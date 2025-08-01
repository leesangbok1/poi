export function renderAnswerCard(answer) {
    if (!answer || !answer.author) return '';
    const author = answer.author;
    const expertBadge = author.isExpert ? '<span class="expert-badge">전문가</span>' : '';
    return `
        <div class="answer-card">
            <div class="answer-meta">
                <img src="${author.profilePic}" alt="${author.name}">
                <span class="author-name">${author.name} ${expertBadge}</span>
            </div>
            <div class="answer-body">${answer.content}</div>
        </div>
    `;
}
