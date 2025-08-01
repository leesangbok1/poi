import { renderPostCard } from '../components/PostCard.js';
import { getTranslator } from '../i18n/i18n.js';

export function renderHomePage(container, state) {
    const t = getTranslator();
    const placeholders = t('question_placeholders');
    const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

    let mainInteractionHTML = '';
    let switchButtonHTML = '';

    if (state.abTestGroup === 'A') {
        mainInteractionHTML = `
            <h1>${t('ask_a_question_title')}</h1>
            <form class="question-form">
                <textarea name="question-content" required placeholder="${randomPlaceholder}"></textarea>
                <button type="submit">${t('submit_question')}</button>
            </form>
        `;
        switchButtonHTML = `
            <button class="switch-view-button" id="switch-to-search-view" title="${t('switch_to_search_view')}">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        `;
    } else {
        mainInteractionHTML = `
            <h1>${t('search_knowledge_title')}</h1>
            <form class="search-form">
                <input type="text" placeholder="${randomPlaceholder}">
                <button type="submit"><i class="fa-solid fa-magnifying-glass"></i> ${t('search_button')}</button>
            </form>
        `;
        switchButtonHTML = `
            <button class="switch-view-button" id="switch-to-question-view" title="${t('switch_to_question_view')}">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
        `;
    }

    const postsHTML = state.posts.map(post => renderPostCard(post)).join('');

    container.innerHTML = `
        <div class="home-main">
            <div class="view-switch-container">
                ${switchButtonHTML}
            </div>
            ${mainInteractionHTML}
        </div>
        <div class="post-list-section home-main">
            <h2>${t('latest_questions')}</h2>
            <div class="post-list">
                ${postsHTML.length > 0 ? postsHTML : `<p>${t('no_questions')}</p>`}
            </div>
            <button class="load-more-button">${t('load_more')}</button>
        </div>
    `;
}
