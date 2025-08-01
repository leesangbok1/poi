export function renderPostCard(post) {
    const authorName = post.author ? post.author.name : 'Unknown';
    const expertBadge = post.author && post.author.isExpert ? '<span class="expert-badge">전문가</span>' : '';
    const certificationInfo = post.author && post.author.certification ? `<span class="author-certification">(${post.author.certification})</span>` : '';
    return `
        <div class="post-card" data-post-id="${post.id}">
            <div>
                <h3>${post.title}</h3>
                <p>by ${authorName} ${expertBadge} ${certificationInfo}</p>
                <div class="post-meta">
                    <button class="like-button" data-type="post" data-id="${post.id}">
                        <i class="fa-solid fa-heart"></i> ${post.likes || 0}
                    </button>
                    <span class="view-count"><i class="fa-solid fa-eye"></i> ${post.viewCount || 0}</span>
                    <span class="answer-count"><i class="fa-solid fa-comments"></i> ${post.answerCount || 0}</span>
                </div>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
            <button class="share-button" data-post-id="${post.id}" title="공유하기"><i class="fa-solid fa-share-nodes"></i></button>
        </div>
    `;
}
