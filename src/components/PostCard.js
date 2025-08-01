export function renderPostCard(post) {
    const authorName = post.author ? post.author.name : 'Unknown';
    return `
        <div class="post-card" data-post-id="${post.id}">
            <div>
                <h3>${post.title}</h3>
                <p>by ${authorName}</p>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
        </div>
    `;
}
