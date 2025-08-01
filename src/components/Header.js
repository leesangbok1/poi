import { getTranslator } from '../i18n/i18n.js';

export function renderHeader(currentUser) {
    const t = getTranslator();
    let authSectionHTML = '';
    if (currentUser) {
        authSectionHTML = `
            <div class="user-profile-menu">
                <img src="${currentUser.profilePic}" alt="${currentUser.name}" class="profile-pic-small" id="user-profile-pic">
                <div class="dropdown-menu" id="user-dropdown-menu">
                    <div class="user-info">
                        <p>${currentUser.name}</p>
                        <span>${currentUser.email || ''}</span>
                    </div>
                    <a href="#" id="logout-button"><i class="fa-solid fa-right-from-bracket"></i> ${t('logout')}</a>
                </div>
            </div>
            <button class="menu-button" title="${t('certification')}" id="certification-button">
                <i class="fa-solid fa-shield-halved"></i>
            </button>
        `;
    } else {
        authSectionHTML = `
            <button class="menu-button" title="${t('login_signup')}" id="login-signup-button">
                 <i class="fa-solid fa-right-to-bracket"></i>
            </button>
        `;
    }

    return `
        <header>
            <div class="container header-content">
                <div class="icon-container" style="margin-right: 10px;">🛡️</div>
                <div class="logo">Viet K-Connect</div>
                <div class="header-menu">
                    <div class="language-switcher">
                        <button class="menu-button" id="language-button">
                            <i class="fa-solid fa-globe"></i>
                        </button>
                        <div class="dropdown-menu" id="language-dropdown-menu">
                            <a href="#" class="language-option" data-lang="ko">한국어</a>
                            <a href="#" class="language-option" data-lang="en">English</a>
                            <a href="#" class="language-option" data-lang="vi">Tiếng Việt</a>
                        </div>
                    </div>
                    ${authSectionHTML}
                </div>
            </div>
        </header>
    `;
}
