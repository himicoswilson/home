const projectsData = [
    {
        title: '职航星途',
        description: {
            zh: '基于 Vue、SpringBoot、WeChat Mini Program 的全栈实习平台，提供全流程数字化管理、校企资源智能匹配、数据可视化分析及移动端便捷服务。',
            en: 'Full-stack internship platform built with Vue, SpringBoot and WeChat Mini Program, featuring digitalized process management, intelligent school-enterprise matching, data visualization and mobile services.'
        },
        tags: ['Vue', 'SpringBoot', 'MySQL', 'WeChat Mini Program'],
        url: '#小程序://职航/7VVrwbWXTrD0l5t',
    }
];

function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    const currentLang = window.i18n ? window.i18n.getCurrentLang() : 'zh';

    projectsGrid.innerHTML = projectsData.map(project => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="${project.linkLabel ? project.linkLabel[currentLang] : 'View Project'}">
                    →
                </a>
            </div>
            <p class="project-description">
                ${project.description[currentLang]}
            </p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');

    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

window.renderProjects = renderProjects;
