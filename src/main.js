// --- 1. MOCK DATA ---
// 실제 앱에서는 Firebase/Firestore에서 가져올 데이터입니다.
const mockUsers = {
    'user01': { name: 'Minh', profilePic: 'https://placehold.co/40x40/31343C/FFFFFF?text=M' },
    'user02': { name: 'Hoa', profilePic: 'https://placehold.co/40x40/9C27B0/FFFFFF?text=H' },
    'user03': { name: 'Khang', profilePic: 'https://placehold.co/40x40/00BCD4/FFFFFF?text=K' },
    'expert01': { name: '김민준 행정사', profilePic: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=E' },
};

const mockPosts = [
    { id: 'post001', title: 'F-2-R 비자, 지역특화형 비자에 대해 궁금합니다.', authorId: 'user01', content: '안녕하세요. 최근에 F-2-R 비자에 대해 알게 되었습니다. 요건이 어떻게 되고, 어떤 지역에서 신청할 수 있는지 경험자분들의 조언을 구합니다.', answers: ['ans001', 'ans002'] },
    { id: 'post002', title: '한국에서 운전면허 교환 발급 절차는 어떻게 되나요?', authorId: 'user02', content: '베트남 면허증을 한국 면허증으로 바꾸고 싶습니다. 필요한 서류와 절차, 소요 기간이 궁금해요.', answers: ['ans003'] },
    { id: 'post003', title: 'TOPIK 시험 준비, 효과적인 공부법 좀 알려주세요.', authorId: 'user03', content: '읽기, 듣기, 쓰기 파트별로 어떻게 공부해야 효율적일까요? 점수가 잘 안 올라서 고민입니다.', answers: [] },
    { id: 'post004', title: '월세 계약 시 반드시 확인해야 할 특약사항은?', authorId: 'user01', content: '곧 월세 계약을 앞두고 있는데, 계약서에 어떤 특약사항을 넣어야 나중에 불이익이 없을지 걱정됩니다.', answers: [] },
];

const mockAnswers = {
    'ans001': { id: 'ans001', authorId: 'user02', content: '저도 작년에 신청해서 받았습니다! 일단 해당 지역에 거주해야 하고, 지자체에서 발급하는 추천서가 필수입니다. 소득 요건도 있으니 공고를 잘 확인해야 해요.' },
    'ans002': { id: 'ans002', authorId: 'expert01', content: '전문가 의견: F-2-R 비자는 인구감소지역 활성화를 위한 제도로, 지자체별 요건이 상이합니다. 기본적으로 법무부 고시 소득요건(전년도 GNI 70% 이상)과 해당 지자체의 추천서가 핵심입니다. 추천서 발급 기준(취업/창업 분야, 거주 기간 등)을 먼저 확인하시는 것이 중요합니다.' },
    'ans003': { id: 'ans003', authorId: 'user03', content: '대사관에서 베트남 면허증 번역 공증을 받고, 출입국사실증명서, 신분증 등을 챙겨서 가까운 운전면허시험장에 가면 됩니다. 간단한 신체검사 후 바로 발급해줬어요.' },
};

// --- 2. STATE MANAGEMENT ---
const app = document.getElementById('app');
const state = {
    currentPage: 'home', // 'home' or 'postDetail'
    currentPostId: null,
    homeViewType: 'A', // A/B 테스트 결과 (A: 질문, B: 검색)
    postViewTypes: {}, // { postId: 'A' or 'B' }
};

// --- 3. ROUTER / RENDERER ---
function navigate(page, postId = null) {
    state.currentPage = page;
    state.currentPostId = postId;
    render();
}

function render() {
    // 앱 컨테이너 비우기
    app.innerHTML = '';

    // 헤더 렌더링
    app.insertAdjacentHTML('beforeend', renderHeader());

    // 페이지 컨테이너 생성
    const pageContainer = document.createElement('div');
    pageContainer.className = 'page-container container';
    app.appendChild(pageContainer);

    // 현재 페이지에 따라 콘텐츠 렌더링
    if (state.currentPage === 'home') {
        renderHomePage(pageContainer);
    } else if (state.currentPage === 'postDetail') {
        renderPostDetailPage(pageContainer, state.currentPostId);
    }
}

// --- 4. COMPONENT RENDERERS ---

function renderHeader() {
    return `
        <header>
            <div class="container header-content">
                <div class="logo">Viet K-Connect</div>
                <div class="header-menu">
                    <button class="menu-button" title="로그인/가입">
                        <i class="fa-solid fa-user-plus"></i>
                    </button>
                    <button class="menu-button" title="메뉴">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
        </header>
    `;
}

function renderHomePage(container) {
    let mainContentHTML = '';
    if (state.homeViewType === 'A') {
        // A안: 질문 우선형
        mainContentHTML = `
            <h1>한국 생활이 막막할 땐?<br>경험자에게 직접 질문하세요!</h1>
            <div class="question-form">
                <textarea placeholder="예: 한국에서 은행 계좌를 만들려면 뭐가 필요한가요?"></textarea>
                <button>질문 등록하기</button>
            </div>
        `;
    } else {
        // B안: 검색 우선형
        mainContentHTML = `
            <h1>어떤 정보가 궁금하세요?<br>전문가가 검증한 지식을 검색해 보세요.</h1>
            <div class="search-form">
                <input type="text" placeholder="궁금한 것을 검색하세요 (예: F-2-R 비자)">
                <button><i class="fa-solid fa-magnifying-glass"></i> 검색</button>
            </div>
        `;
    }

    const postsHTML = mockPosts.map(post => renderPostCard(post)).join('');

    container.innerHTML = `
        <div class="home-main">
            ${mainContentHTML}
        </div>
        <div class="post-list home-main">
            <div class="post-grid">
                <div>
                    <h2>최신 질문</h2>
                    ${postsHTML}
                    <a class="more-button" data-post-id="all">더보기 ></a>
                </div>
                <div>
                    <h2>인기 질문</h2>
                    ${postsHTML}
                     <a class="more-button" data-post-id="all">더보기 ></a>
                </div>
            </div>
        </div>
    `;
}

function renderPostCard(post) {
    const author = mockUsers[post.authorId];
    return `
        <div class="post-card" data-post-id="${post.id}">
            <div>
                <h3>${post.title}</h3>
                <p>by ${author.name}</p>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
        </div>
    `;
}

function renderPostDetailPage(container, postId) {
    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
        container.innerHTML = `<p>게시글을 찾을 수 없습니다.</p><a href="#" class="back-button">홈으로 돌아가기</a>`;
        return;
    }

    const author = mockUsers[post.authorId];
    
    // 이 게시글의 A/B 테스트 타입 결정
    if (!state.postViewTypes[postId]) {
        state.postViewTypes[postId] = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem(`postViewType_${postId}`, state.postViewTypes[postId]);
    }
    const viewType = state.postViewTypes[postId];

    let answersHTML = '';
    let expertVerificationHTML = '';

    if (viewType === 'A') {
        // A안: 사용자 Q&A 중심
        answersHTML = post.answers.map(ansId => renderAnswerCard(mockAnswers[ansId])).join('');
    } else {
        // B안: 전문가 2차 검증
        const expertAnswer = post.answers
            .map(id => mockAnswers[id])
            .find(ans => ans.authorId.startsWith('expert'));
        
        if (expertAnswer) {
            expertVerificationHTML = `
                <div class="expert-verification">
                    <div class="expert-title"><i class="fa-solid fa-check-circle"></i> 전문가 2차 검증 요약</div>
                    <p class="expert-summary">${expertAnswer.content}</p>
                </div>
            `;
        }
        answersHTML = post.answers.map(ansId => renderAnswerCard(mockAnswers[ansId])).join('');
    }

    container.innerHTML = `
        <div class="post-detail-page">
            <a class="back-button">&lt; 목록으로 돌아가기</a>
            <div class="post-content-card">
                <h1>${post.title}</h1>
                <div class="post-meta">작성자: ${author.name}</div>
                <div class="post-body">${post.content}</div>
                ${expertVerificationHTML}
            </div>
            <div class="answers-section">
                <h2>답변 ${post.answers.length}개</h2>
                ${answersHTML}
            </div>
        </div>
    `;
}

function renderAnswerCard(answer) {
    if (!answer) return '';
    const author = mockUsers[answer.authorId];
    return `
        <div class="answer-card">
            <div class="answer-meta">
                <img src="${author.profilePic}" alt="${author.name}">
                <span class="author-name">${author.name}</span>
            </div>
            <div class="answer-body">${answer.content}</div>
        </div>
    `;
}

// --- 5. EVENT HANDLERS ---
app.addEventListener('click', (e) => {
    // 게시글 카트 클릭 시 상세 페이지로 이동
    const postCard = e.target.closest('.post-card');
    if (postCard) {
        const postId = postCard.dataset.postId;
        navigate('postDetail', postId);
        return;
    }

    // '더보기' 버튼 클릭 (임시로 첫번째 게시글로 이동)
    const moreButton = e.target.closest('.more-button');
    if (moreButton) {
        navigate('postDetail', mockPosts[0].id);
        return;
    }

    // '뒤로가기' 버튼 클릭
    const backButton = e.target.closest('.back-button');
    if (backButton) {
        navigate('home');
        return;
    }
    
    // 로고 클릭 시 홈으로 이동
    const logo = e.target.closest('.logo');
    if (logo) {
        navigate('home');
        return;
    }
});

// --- 6. INITIALIZATION ---
function init() {
    // 홈페이지 A/B 테스트 타입 결정
    let homeView = localStorage.getItem('homeViewType');
    if (!homeView) {
        homeView = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem('homeViewType', homeView);
    }
    state.homeViewType = homeView;

    // 각 게시글의 A/B 테스트 타입 로드
    mockPosts.forEach(post => {
        const postView = localStorage.getItem(`postViewType_${post.id}`);
        if (postView) {
            state.postViewTypes[post.id] = postView;
        }
    });
    
    // 초기 렌더링
    render();
}

// 앱 시작
init();
