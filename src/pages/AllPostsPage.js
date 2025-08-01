import { renderPostCard } from '../components/PostCard.js';

export function renderAllPostsPage(container, state) {
    let filterButtonsHTML = '';
    if (state.abTestGroup === 'A') {
        // Expert Focus: Organize posts by professional categories
        const categories = ['Visa/Legal', 'Employment', 'Education', 'Daily Life'];
        filterButtonsHTML = categories.map(cat => `<button class="filter-button" data-type="category" data-value="${cat}">${cat}</button>`).join('');
    } else {
        // Community Focus: Organize posts by user engagement
        const engagementTypes = [
            { label: 'Hot Topics', value: 'Hot Topics' },
            { label: 'Recent Questions', value: 'Recent' },
            { label: 'Unanswered', value: 'Unanswered' }
        ];
        filterButtonsHTML = engagementTypes.map(type => `<button class="filter-button" data-type="engagement" data-value="${type.value}">${type.label}</button>`).join('');
    }

    const postsHTML = state.allPosts.map(post => renderPostCard(post)).join('');

    container.innerHTML = `
        <div class="all-posts-page">
            <div class="filter-controls">
                ${filterButtonsHTML}
            </div>
            <div class="post-list">
                ${postsHTML.length > 0 ? postsHTML : '<p>표시할 게시글이 없습니다.</p>'}
            </div>
            <div class="pagination-controls">
                <button class="prev-page-button" ${state.currentPageNumber <= 1 ? 'disabled' : ''}>이전</button>
                <span>Page ${state.currentPageNumber}</span>
                <button class="next-page-button" ${state.allPosts.length < 10 ? 'disabled' : ''}>다음</button>
            </div>
        </div>
    `;
}
