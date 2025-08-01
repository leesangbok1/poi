// --- API & Component Imports ---
import {
    populateDatabase,
    fetchHomepagePosts,
    fetchPostDetails,
    fetchPaginatedPosts,
    createQuestion,
    createAnswer,
    signInWithGoogle,
    signInWithFacebook,
    signOutUser,
    onAuthChange
} from './api/firebase.js';
import { renderHeader } from './components/Header.js';
import { renderSpinner } from './components/Spinner.js';
import { renderHomePage } from './pages/HomePage.js';
import { renderPostDetailPage } from './pages/PostDetailPage.js';
import { renderAllPostsPage } from './pages/AllPostsPage.js';
import { renderLoginModal } from './components/LoginModal.js';
import { initI18n, setLanguage, getLanguage } from './i18n/i18n.js';

// --- GLOBAL STATE ---
const app = document.getElementById('app');
const state = {
    currentPage: 'home',
    currentPostId: null,
    abTestGroup: 'A',
    language: 'ko',
    posts: [], // For homepage
    users: {}, // Simple cache for user data
    currentUser: null, // Will be set by Firebase Auth
    isLoading: true,
    allPosts: [],
    lastVisiblePost: null,
    firstVisiblePost: null,
    currentPageNumber: 1,
    activeFilter: { type: null, value: null },
    isUserDropdownOpen: false,
    isLangDropdownOpen: false,
    isLoginModalOpen: false,
};

// --- MODAL & DROPDOWN CONTROL ---
function openLoginModal() {
    if (state.isLoginModalOpen) return;
    state.isLoginModalOpen = true;
    const modalHTML = renderLoginModal();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setTimeout(() => {
        document.getElementById('login-modal-overlay')?.classList.add('show');
    }, 10);
}

function closeLoginModal() {
    if (!state.isLoginModalOpen) return;
    const modalOverlay = document.getElementById('login-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('show');
        modalOverlay.addEventListener('transitionend', () => modalOverlay.remove(), { once: true });
    }
    state.isLoginModalOpen = false;
}

function toggleDropdown(type, forceClose = false) {
    const dropdownId = type === 'user' ? 'user-dropdown-menu' : 'language-dropdown-menu';
    const stateKey = type === 'user' ? 'isUserDropdownOpen' : 'isLangDropdownOpen';
    
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    if (forceClose || state[stateKey]) {
        dropdown.classList.remove('show');
        state[stateKey] = false;
    } else {
        // Close other dropdowns before opening a new one
        toggleDropdown('user', true);
        toggleDropdown('language', true);
        
        dropdown.classList.add('show');
        state[stateKey] = true;
    }
}

// --- ROUTING & RENDERING ---
async function navigate(page, payload = null) {
    state.currentPage = page;
    state.isLoading = true;
    render(); 

    if (page === 'home') {
        state.posts = await fetchHomepagePosts(state.users);
    } else if (page === 'postDetail') {
        state.currentPostId = payload;
        const postData = await fetchPostDetails(payload, state.users);
        state.isLoading = false;
        render(postData);
        return;
    } else if (page === 'allPosts') {
        state.activeFilter = payload || { type: null, value: null };
        state.currentPageNumber = 1;
        state.lastVisiblePost = null;
        state.firstVisiblePost = null;
        await handleFetchPaginatedPosts('first');
    }

    state.isLoading = false;
    render();
}

function render(data = null) {
    app.innerHTML = '';
    app.insertAdjacentHTML('beforeend', renderHeader(state.currentUser));
    const pageContainer = document.createElement('div');
    pageContainer.className = 'page-container container';
    app.appendChild(pageContainer);

    if (state.isLoading) {
        pageContainer.innerHTML = renderSpinner();
        return;
    }

    switch (state.currentPage) {
        case 'home':
            renderHomePage(pageContainer, state);
            break;
        case 'postDetail':
            renderPostDetailPage(pageContainer, data);
            break;
        case 'allPosts':
            renderAllPostsPage(pageContainer, state);
            break;
    }
}

// --- DATA HANDLING ---
async function handleFetchPaginatedPosts(direction) {
    const { posts, firstVisible, lastVisible } = await fetchPaginatedPosts(
        state.activeFilter,
        direction === 'next' ? state.lastVisiblePost : null,
        direction === 'prev' ? state.firstVisiblePost : null,
        state.users
    );
    if (posts.length > 0) {
        state.allPosts = posts;
        state.firstVisiblePost = firstVisible;
        state.lastVisiblePost = lastVisible;
        if (direction === 'next') state.currentPageNumber++;
        if (direction === 'prev') state.currentPageNumber = Math.max(1, state.currentPageNumber - 1);
    } else if (direction === 'next') {
        alert("마지막 페이지입니다.");
    }
}

// --- EVENT HANDLERS ---
function setupEventListeners() {
    document.body.addEventListener('submit', async (e) => {
        if (e.target.matches('.question-form') || e.target.matches('.search-form')) {
            e.preventDefault();
            if (!state.currentUser) {
                openLoginModal();
                return;
            }
            if (e.target.matches('.question-form')) {
                const content = e.target.elements['question-content'].value.trim();
                const title = content.split('\n')[0].substring(0, 50);
                if (content) {
                    e.target.elements['question-content'].value = '';
                    await createQuestion(title, content, state.currentUser);
                    await navigate('home');
                }
            } else {
                 await navigate('allPosts');
            }
        } else if (e.target.matches('.answer-form')) {
            e.preventDefault();
            if (!state.currentUser) {
                openLoginModal();
                return;
            }
            const content = e.target.elements['answer-content'].value.trim();
            const postId = e.target.dataset.postId;
            if (content && postId) {
                e.target.elements['answer-content'].value = '';
                await createAnswer(postId, content, state.currentUser);
                await navigate('postDetail', postId);
            }
        }
    });

    document.body.addEventListener('click', async (e) => {
        const target = e.target;

        // Close dropdowns if clicked outside
        if (!target.closest('.user-profile-menu')) toggleDropdown('user', true);
        if (!target.closest('.language-switcher')) toggleDropdown('language', true);

        // Modal interactions
        if (target.closest('#login-signup-button')) {
            e.preventDefault();
            openLoginModal();
        } else if (target.matches('#close-login-modal') || target.id === 'login-modal-overlay') {
            e.preventDefault();
            closeLoginModal();
        } else if (target.closest('#modal-google-login-button')) {
            e.preventDefault();
            try {
                await signInWithGoogle();
                closeLoginModal();
            } catch (error) {
                console.error("Google login failed:", error);
            }
        } else if (target.closest('#modal-facebook-login-button')) {
            e.preventDefault();
            try {
                await signInWithFacebook();
                closeLoginModal();
            } catch (error) {
                console.error("Facebook login failed:", error);
            }
        } 
        // Dropdown & Language
        else if (target.closest('#user-profile-pic')) {
            e.preventDefault();
            toggleDropdown('user');
        } else if (target.closest('#language-button')) {
            e.preventDefault();
            toggleDropdown('language');
        } else if (target.closest('.language-option')) {
            e.preventDefault();
            const lang = target.closest('.language-option').dataset.lang;
            setLanguage(lang);
            render();
            toggleDropdown('language', true);
        }
        // A/B Test view switch
        else if (target.closest('#switch-to-search-view') || target.closest('#switch-to-question-view')) {
            e.preventDefault();
            state.abTestGroup = state.abTestGroup === 'A' ? 'B' : 'A';
            localStorage.setItem('abTestGroup', state.abTestGroup);
            render();
        }
        // Page navigation and actions
        else if (target.closest('.post-card')) {
            e.preventDefault();
            navigate('postDetail', target.closest('.post-card').dataset.postId);
        } else if (target.closest('.back-button') || target.closest('.logo')) {
            e.preventDefault();
            navigate('home');
        } else if (target.closest('.load-more-button')) {
            e.preventDefault();
            navigate('allPosts');
        } else if (target.matches('.filter-button')) {
            e.preventDefault();
            const type = target.dataset.type;
            const value = target.dataset.value;
            navigate('allPosts', { type, value });
        } else if (target.matches('.next-page-button')) {
            e.preventDefault();
            state.isLoading = true; render();
            await handleFetchPaginatedPosts('next');
            state.isLoading = false; render();
        } else if (target.matches('.prev-page-button')) {
            e.preventDefault();
            state.isLoading = true; render();
            await handleFetchPaginatedPosts('prev');
            state.isLoading = false; render();
        } else if (target.closest('#logout-button')) {
            e.preventDefault();
            try {
                await signOutUser();
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }
    });
}

// --- INITIALIZATION ---
async function init() {
    initI18n();
    state.language = getLanguage();

    let group = localStorage.getItem('abTestGroup');
    if (!group) {
        group = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem('abTestGroup', group);
    }
    state.abTestGroup = group;
    
    setupEventListeners();

    onAuthChange(async (user) => {
        state.currentUser = user;
        if (user) {
            state.users[user.id] = user;
        }
        // No need to navigate here, render() will be called by language change or other actions
        render();
    });

    await populateDatabase();
    await navigate('home');
}

// --- APP START ---
init();