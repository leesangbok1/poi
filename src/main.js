import './style.css';

// Firebase SDK import (Firestore만 사용)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- Firebase Configuration ---
// 이전에 제공해주신 실제 키 값으로 설정했습니다.
const firebaseConfig = {
  apiKey: "AIzaSyD2QPAw8vXMiUq3Y5UqIEYmBJ83kR_wZiQ",
  authDomain: "bkbk-4a19b.firebaseapp.com",
  projectId: "bkbk-4a19b",
  storageBucket: "bkbk-4a19b.appspot.com",
  messagingSenderId: "832841055194",
  appId: "1:832841055194:web:283fb5b9c4ac9ccb8c1ee3",
  measurementId: "G-QSTGG3WLSS"
};

// --- Firebase & Firestore Initialization ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- App HTML Structure ---
const appContainer = document.getElementById('app');
const appHTML = `
    <header class="w-full p-4 fixed top-0 left-0 bg-white/80 backdrop-blur-sm z-20 shadow-sm">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <a href="#" class="text-xl font-bold text-gray-800 tracking-tight">Viet K-Connect</a>
            <div class="flex items-center space-x-2">
                <div class="relative">
                    <button id="langMenuButton" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100">
                        <i class="fa-solid fa-globe text-xl"></i>
                    </button>
                    <div id="langMenu" class="hidden absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-30">
                        <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700">
                            <img src="https://placehold.co/20x15/0066CC/FFFFFF?text=VI" alt="Vietnam Flag" class="mr-2"> Tiếng Việt
                        </a>
                        <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700">
                            <img src="https://placehold.co/20x15/CD2E3A/FFFFFF?text=KR" alt="Korea Flag" class="mr-2"> 한국어
                        </a>
                        <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700">
                            <img src="https://placehold.co/20x15/00247D/FFFFFF?text=EN" alt="USA Flag" class="mr-2"> English
                        </a>
                    </div>
                </div>
                <div class="relative">
                    <button id="userMenuButton" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100">
                        <i class="fa-solid fa-bars text-xl"></i>
                    </button>
                    <div id="userMenu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">마이페이지</a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">기업 서비스</a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">로그아웃</a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div id="mainContent" class="w-full pt-32 pb-12 px-4 flex flex-col items-center">
        <!-- Version A: 직접 질문 (Question First) -->
        <main id="versionA" class="w-full max-w-3xl text-center mx-auto search-container hidden">
            <h1 class="text-2xl md:text-3xl font-medium text-gray-800 mb-10">한국 생활이 막막할 땐? <span class="text-green-600 font-semibold">한국 생활 선경험자</span>에게 바로 질문하세요.</h1>
            <div class="relative w-full shadow-lg rounded-lg bg-white p-4">
                <textarea placeholder="예: 한국에서 은행 계좌를 만들려면 뭐가 필요한가요?" class="w-full p-2 rounded-md text-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" rows="6"></textarea>
                <div class="text-right mt-3">
                    <button id="ctaButtonA" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-lg text-md">
                        질문 등록
                    </button>
                </div>
            </div>
        </main>

        <!-- Version B: 지식 검색 (Search First) -->
        <main id="versionB" class="w-full max-w-3xl text-center mx-auto search-container hidden">
             <h1 class="text-2xl md:text-3xl font-medium text-gray-800 mb-10">
                <span class="text-blue-600 font-bold">VIET K-LIVING:</span> 인증된 경험자 답변, 전문가가 한번 더 검증했습니다.
            </h1>
            <div class="relative w-full shadow-lg rounded-full mb-8">
                <input type="text" placeholder="궁금한 것을 검색하세요 (예: F-2-R 비자 신청)" class="w-full py-4 pl-6 pr-52 rounded-full text-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button id="ctaButtonB" class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-full flex items-center text-lg">
                    <i class="fa-solid fa-magnifying-glass mr-2"></i>
                    <span>검증된 지식 검색</span>
                </button>
            </div>
             <div class="grid grid-cols-3 md:grid-cols-6 gap-3 text-center">
                <a href="#" class="category-box"><i class="fa-solid fa-passport text-xl mb-1"></i><span class="font-medium text-sm">비자</span></a>
                <a href="#" class="category-box"><i class="fa-solid fa-briefcase text-xl mb-1"></i><span class="font-medium text-sm">근무</span></a>
                <a href="#" class="category-box"><i class="fa-solid fa-graduation-cap text-xl mb-1"></i><span class="font-medium text-sm">유학</span></a>
                <a href="#" class="category-box"><i class="fa-solid fa-house text-xl mb-1"></i><span class="font-medium text-sm">부동산</span></a>
                <a href="#" class="category-box"><i class="fa-solid fa-comments text-xl mb-1"></i><span class="font-medium text-sm">생활정보</span></a>
                <a href="#" class="category-box"><i class="fa-solid fa-users text-xl mb-1"></i><span class="font-medium text-sm">커뮤니티</span></a>
            </div>
        </main>

        <section id="postsA" class="w-full max-w-5xl mx-auto mt-12 posts-container"></section>
        <section id="postsB" class="w-full max-w-5xl mx-auto mt-12 posts-container hidden"></section>
    </div>
`;
appContainer.innerHTML = appHTML;

// --- Dynamic Content Injection ---
const postsA_HTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div>
            <div class="flex justify-between items-center mb-4"><h2 class="text-xl font-bold">최신 게시글</h2><a href="#" class="text-sm font-medium text-gray-500 hover:text-green-600 more-button">더보기 &gt;</a></div>
            <div class="space-y-4">
                <a href="#" class="post-card flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p class="text-gray-800"><span class="font-bold text-green-600">Q.</span> TOPIK 시험 준비, 효과적인 공부법이 궁금...</p>
                        <div class="mt-2 text-sm text-gray-700"><span class="font-semibold text-green-800">답변:</span> <span class="font-medium">minh_life</span> <span class="text-xs text-gray-500">(TOPIK 6급 인증 <i class="fa-solid fa-check-circle text-green-500"></i>)</span></div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4"><span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">3분 전</span></div>
                </a>
                <a href="#" class="post-card flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p class="text-gray-800"><span class="font-bold text-green-600">Q.</span> 한국 대학교 편입 정보를 어디서 얻어야...</p>
                        <div class="mt-2 text-sm text-gray-700"><span class="font-semibold text-green-800">답변:</span> <span class="font-medium">hoa_study</span> <span class="text-xs text-gray-500">(서울대 재학 중 <i class="fa-solid fa-check-circle text-green-500"></i>)</span></div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4"><span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">18분 전</span></div>
                </a>
            </div>
        </div>
        <div>
            <div class="flex justify-between items-center mb-4"><h2 class="text-xl font-bold">주간 인기 게시글</h2><a href="#" class="text-sm font-medium text-gray-500 hover:text-green-600 more-button">더보기 &gt;</a></div>
            <div class="space-y-4">
                <a href="#" class="post-card flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p class="text-gray-800"><span class="font-bold text-green-600">Q.</span> 외국인등록증 재발급, 직접 해보신 분 계...</p>
                        <div class="mt-2 text-sm text-gray-700"><span class="font-semibold text-green-800">답변:</span> <span class="font-medium">trang_92</span> <span class="text-xs text-gray-500">(E-7-4 비자 인증 <i class="fa-solid fa-check-circle text-green-500"></i>)</span></div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4 space-y-1">
                        <span class="text-xs text-red-500 flex items-center justify-end"><i class="fa-solid fa-heart mr-1"></i> 1,204</span>
                        <span class="text-xs text-gray-500 flex items-center justify-end"><i class="fa-solid fa-eye mr-1"></i> 15.2k</span>
                    </div>
                </a>
                <a href="#" class="post-card flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p class="text-gray-800"><span class="font-bold text-green-600">Q.</span> 한국에서 유용한 은행 앱 추천 좀 해주...</p>
                        <div class="mt-2 text-sm text-gray-700"><span class="font-semibold text-green-800">답변:</span> <span class="font-medium">bao_han</span> <span class="text-xs text-gray-500">(현대중공업 재직 중 <i class="fa-solid fa-check-circle text-green-500"></i>)</span></div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4 space-y-1">
                        <span class="text-xs text-red-500 flex items-center justify-end"><i class="fa-solid fa-heart mr-1"></i> 988</span>
                        <span class="text-xs text-gray-500 flex items-center justify-end"><i class="fa-solid fa-eye mr-1"></i> 12.1k</span>
                    </div>
                </a>
            </div>
        </div>
    </div>`;

const postsB_HTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div>
            <div class="flex justify-between items-center mb-4"><h2 class="text-xl font-bold">최신 게시글</h2><a href="#" class="text-sm font-medium text-gray-500 hover:text-blue-600 more-button">더보기 &gt;</a></div>
            <div class="space-y-4">
                <a href="#" class="post-card flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p class="text-gray-800"><span class="font-bold text-blue-600">Q.</span> E-7-4 비자 점수 계산이 너무 복잡해요...</p>
                        <div class="mt-2 text-sm text-gray-700"><span class="font-semibold text-blue-800">답변:</span> <span class="font-medium">kim_law</span> <span class="text-xs text-gray-500">(행정사 인증 <i class="fa-solid fa-check-circle text-blue-500"></i>)</span></div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4"><span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">1시간 전</span></div>
                </a>
                <a href="#" class="post-card flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p class="text-gray-800"><span class="font-bold text-blue-600">Q.</span> 퇴직금 중간정산, 가능한 경우인가요? ...</p>
                        <div class="mt-2 text-sm text-gray-700"><span class="font-semibold text-blue-800">답변:</span> <span class="font-medium">lee_labor</span> <span class="text-xs text-gray-500">(노무사 인증 <i class="fa-solid fa-check-circle text-blue-500"></i>)</span></div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4"><span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">3시간 전</span></div>
                </a>
            </div>
        </div>
        <div>
            <div class="flex justify-between items-center mb-4"><h2 class="text-xl font-bold">주간 인기 게시글</h2><a href="#" class="text-sm font-medium text-gray-500 hover:text-blue-600 more-button">더보기 &gt;</a></div>
            <div class="space-y-4">
                <a href="#" class="post-card flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p class="text-gray-800"><span class="font-bold text-blue-600">Q.</span> 2024년 최신 F-2-R 비자 총정리...</p>
                        <div class="mt-2 text-sm text-gray-700"><span class="font-semibold text-blue-800">답변:</span> <span class="font-medium">park_visa</span> <span class="text-xs text-gray-500">(비자 5년차 전문가 <i class="fa-solid fa-check-circle text-blue-500"></i>)</span></div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4 space-y-1">
                        <span class="text-xs text-red-500 flex items-center justify-end"><i class="fa-solid fa-heart mr-1"></i> 2,150</span>
                        <span class="text-xs text-gray-500 flex items-center justify-end"><i class="fa-solid fa-eye mr-1"></i> 23.8k</span>
                    </div>
                </a>
                <a href="#" class="post-card flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p class="text-gray-800"><span class="font-bold text-blue-600">Q.</span> 월세 계약 시 반드시 확인해야 할 특약...</p>
                        <div class="mt-2 text-sm text-gray-700"><span class="font-semibold text-blue-800">답변:</span> <span class="font-medium">choi_realty</span> <span class="text-xs text-gray-500">(행정사 인증 <i class="fa-solid fa-check-circle text-blue-500"></i>)</span></div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-4 space-y-1">
                        <span class="text-xs text-red-500 flex items-center justify-end"><i class="fa-solid fa-heart mr-1"></i> 1,842</span>
                        <span class="text-xs text-gray-500 flex items-center justify-end"><i class="fa-solid fa-eye mr-1"></i> 19.5k</span>
                    </div>
                </a>
            </div>
        </div>
    </div>`;

document.getElementById('postsA').innerHTML = postsA_HTML;
document.getElementById('postsB').innerHTML = postsB_HTML;

// --- Firestore Logging Function ---
async function logToFirestore(eventName, eventData = {}) {
  try {
    const docRef = await addDoc(collection(db, "ab_test_events"), {
      name: eventName,
      ...eventData,
      timestamp: serverTimestamp()
    });
    console.log(`Event '${eventName}' logged to Firestore with ID: ${docRef.id}`);
  } catch (e) {
    console.error("Error adding document to Firestore: ", e);
  }
}

// --- A/B Test & UI Control Logic ---

function runAbTest() {
    let assignedVersion = localStorage.getItem('abTestVersion');

    if (!assignedVersion) {
        assignedVersion = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem('abTestVersion', assignedVersion);
    }
    
    switchUiToVersion(assignedVersion);
    
    const eventName = assignedVersion === 'A' ? 'view_version_A' : 'view_version_B';
    logToFirestore(eventName);
    
    console.log(`User assigned to version: ${assignedVersion}`);

    // Set up the global click listener for the assigned version
    trackFirstEngagement(assignedVersion);
}

function switchUiToVersion(version) {
    const elements = {
        A: { main: document.getElementById('versionA'), posts: document.getElementById('postsA') },
        B: { main: document.getElementById('versionB'), posts: document.getElementById('postsB') }
    };

    const show = elements[version];
    const hide = elements[version === 'A' ? 'B' : 'A'];

    show.main.classList.remove('hidden');
    show.posts.classList.remove('hidden');
    hide.main.classList.add('hidden');
    hide.posts.classList.add('hidden');
}

// New function to track the very first user interaction
function trackFirstEngagement(version) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    mainContent.addEventListener('click', (event) => {
        // We only care about clicks on actual interactive elements like buttons or links
        if (event.target.closest('button, a')) {
            const eventName = `click_version_${version}`;
            logToFirestore(eventName);
            console.log(`First engagement logged for version ${version}`);
        }
    }, { once: true }); // The { once: true } option is key. It removes the listener after the first click.
}

// --- Initial Setup ---
function setupMenuToggle(buttonId, menuId) {
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    if (button && menu) {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        });
    }
}

setupMenuToggle('userMenuButton', 'userMenu');
setupMenuToggle('langMenuButton', 'langMenu');

document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenu');
    const langMenu = document.getElementById('langMenu');
    const userMenuButton = document.getElementById('userMenuButton');
    const langMenuButton = document.getElementById('langMenuButton');

    if (userMenu && !userMenu.classList.contains('hidden') && !userMenu.contains(e.target) && !userMenuButton.contains(e.target)) {
        userMenu.classList.add('hidden');
    }
    if (langMenu && !langMenu.classList.contains('hidden') && !langMenu.contains(e.target) && !langMenuButton.contains(e.target)) {
        langMenu.classList.add('hidden');
    }
});

// Run the A/B test
runAbTest();
