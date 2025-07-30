// 主JavaScript文件 - 实现网站交互功能

// DOM元素引用
const loadingMask = document.getElementById('loading-mask');
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.getElementById('main-menu');
const menuLinks = document.querySelectorAll('.menu-link');
const projectCards = document.querySelectorAll('[data-reveal]');
const eyes = document.querySelectorAll('.eye');
const ctaButton = document.querySelector('.cta-button');

// 页面加载完成后隐藏加载动画
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingMask.classList.add('hidden');
        // 移除加载遮罩以释放内存
        setTimeout(() => {
            loadingMask.remove();
        }, 500);
    }, 1000); // 延迟1秒显示加载效果
});

// 菜单切换功能
function toggleMenu() {
    menuToggle.classList.toggle('active');
    mainMenu.classList.toggle('open');
    
    // 防止背景滚动
    if (mainMenu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// 菜单按钮点击事件
menuToggle.addEventListener('click', toggleMenu);

// 点击菜单外部关闭菜单
document.addEventListener('click', (e) => {
    if (!mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        if (mainMenu.classList.contains('open')) {
            toggleMenu();
        }
    }
});

// ESC键关闭菜单
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainMenu.classList.contains('open')) {
        toggleMenu();
    }
});

// 菜单链接点击处理
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 移除所有活动状态
        menuLinks.forEach(l => l.classList.remove('active'));
        // 添加当前链接的活动状态
        link.classList.add('active');
        
        // 获取目标部分
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // 关闭菜单
            toggleMenu();
            
            // 平滑滚动到目标部分
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    });
});

// 导航栏链接平滑滚动
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer 用于项目卡片揭示动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // 添加延迟以创建交错效果
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, index * 200);
            
            // 停止观察已显示的元素
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 观察所有项目卡片
projectCards.forEach(card => {
    observer.observe(card);
});

// 鼠标跟踪效果 - 眼睛跟随鼠标
let mouseX = 0;
let mouseY = 0;
let isMouseTracking = true;
let isBlinking = false;
let lastBlinkTime = 0;

// 节流函数以优化性能
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 更新眼睛位置
function updateEyePosition() {
    if (!isMouseTracking || isBlinking) return;
    
    eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        
        // 计算鼠标相对于眼睛的角度
        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        
        // 限制眼睛移动范围，让移动更自然
        const maxDistance = 3;
        const distance = Math.min(maxDistance, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 80);
        
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;
        
        // 添加缓动效果
        const currentTransform = eye.style.transform || 'translate(0px, 0px)';
        const currentMatch = currentTransform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
        const currentX = currentMatch ? parseFloat(currentMatch[1]) : 0;
        const currentY = currentMatch ? parseFloat(currentMatch[2]) : 0;
        
        const easedX = currentX + (moveX - currentX) * 0.1;
        const easedY = currentY + (moveY - currentY) * 0.1;
        
        eye.style.transform = `translate(${easedX}px, ${easedY}px)`;
    });
}

// 眨眼效果
function triggerBlink() {
    if (isBlinking) return;
    
    isBlinking = true;
    eyes.forEach(eye => {
        eye.style.animation = 'none';
        eye.style.transform += ' scaleY(0.1)';
    });
    
    setTimeout(() => {
        eyes.forEach(eye => {
            eye.style.transform = eye.style.transform.replace(' scaleY(0.1)', '');
            eye.style.animation = 'blink 3s infinite';
        });
        isBlinking = false;
    }, 150);
}

// 随机眨眼
function randomBlink() {
    const now = Date.now();
    if (now - lastBlinkTime > 3000 && Math.random() < 0.3) {
        triggerBlink();
        lastBlinkTime = now;
    }
}

// 鼠标移动事件（使用节流优化性能）
const throttledEyeUpdate = throttle(updateEyePosition, 16); // ~60fps

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    throttledEyeUpdate();
    
    // 随机眨眼检查
    randomBlink();
});

// 点击头像时的反应
const avatarSvg = document.querySelector('.avatar-svg');
if (avatarSvg) {
    avatarSvg.addEventListener('click', () => {
        // 触发眨眼
        triggerBlink();
        
        // 添加点击动画
        avatarSvg.style.animation = 'none';
        avatarSvg.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            avatarSvg.style.transform = '';
            avatarSvg.style.animation = 'breathe 4s ease-in-out infinite';
        }, 100);
    });
    
    // 鼠标悬停时的效果
    avatarSvg.addEventListener('mouseenter', () => {
        triggerBlink();
    });
}

// 在移动设备上禁用鼠标跟踪
if (window.innerWidth <= 768) {
    isMouseTracking = false;
}

// 窗口大小改变时重新检查
window.addEventListener('resize', () => {
    isMouseTracking = window.innerWidth > 768;
    if (!isMouseTracking) {
        // 重置眼睛位置
        eyes.forEach(eye => {
            eye.style.transform = 'translate(0, 0)';
        });
    }
});

// 简单的视差效果
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.setProperty('--scroll-y', `${yPos}px`);
    });
    
    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

// 滚动事件监听（仅在非移动设备上启用视差效果）
if (window.innerWidth > 768) {
    window.addEventListener('scroll', requestParallaxUpdate);
}

// CTA按钮点击事件
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        // 添加点击动画
        ctaButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            ctaButton.style.transform = 'scale(1)';
        }, 150);
        
        // 滚动到项目部分
        const projectsSection = document.getElementById('work');
        if (projectsSection) {
            projectsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// 项目卡片点击增强效果
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // 添加轻微的倾斜效果
        const randomTilt = (Math.random() - 0.5) * 4; // -2 到 2 度
        card.style.transform = `translateY(-8px) rotate(${randomTilt}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// 平滑滚动到锚点
function smoothScrollToAnchor() {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
}

// 页面加载时检查锚点
window.addEventListener('load', smoothScrollToAnchor);

// 处理浏览器前进后退
window.addEventListener('popstate', smoothScrollToAnchor);

// 键盘导航支持
document.addEventListener('keydown', (e) => {
    // Tab键导航增强
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// 性能优化：在页面不可见时暂停动画
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面不可见时暂停鼠标跟踪
        isMouseTracking = false;
    } else {
        // 页面可见时恢复鼠标跟踪（仅在非移动设备上）
        isMouseTracking = window.innerWidth > 768;
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('JavaScript错误:', e.error);
});

// 控制台欢迎信息
// 加载每日医疗AI新闻
function loadDailyNews() {
    fetch('./news.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }
            return response.json();
        })
        .then(data => {
            if (data.news && data.news.length > 0) {
                displayNewsWithAnimation(data.news);
            } else {
                displayNoNews();
            }
        })
        .catch(error => {
            console.error('Error loading news:', error);
            displayErrorMessage();
        });
}

// 显示新闻动画
function displayNewsWithAnimation(newsArray) {
    const bubbles = [
        document.getElementById('news-bubble-1'),
        document.getElementById('news-bubble-2'),
        document.getElementById('news-bubble-3')
    ];
    
    // 先隐藏所有气泡
    bubbles.forEach(bubble => {
        bubble.classList.add('hidden');
        bubble.classList.remove('show');
    });
    
    // 逐个显示新闻气泡
    newsArray.forEach((news, index) => {
        if (index < 3) {
            setTimeout(() => {
                const bubble = bubbles[index];
                const textElement = bubble.querySelector('.bubble-text');
                const timeElement = bubble.querySelector('.bubble-time');
                
                // 设置内容
                textElement.innerHTML = `<a href="${news.link}" target="_blank" rel="noopener noreferrer">${news.title}</a>`;
                timeElement.textContent = `${news.writer} • ${new Date(news.updated).toLocaleDateString()}`;
                
                // 显示气泡
                bubble.classList.remove('hidden');
                setTimeout(() => {
                    bubble.classList.add('show');
                }, 100);
            }, index * 1000); // 每个气泡间隔1秒显示
        }
    });
}

// 显示无新闻消息
function displayNoNews() {
    const bubble = document.getElementById('news-bubble-1');
    const textElement = bubble.querySelector('.bubble-text');
    const timeElement = bubble.querySelector('.bubble-time');
    
    textElement.textContent = 'No medical AI news available today';
    timeElement.textContent = 'Check back tomorrow for updates';
    
    bubble.classList.remove('hidden');
    setTimeout(() => {
        bubble.classList.add('show');
    }, 100);
}

// 显示错误消息
function displayErrorMessage() {
    const bubble = document.getElementById('news-bubble-1');
    const textElement = bubble.querySelector('.bubble-text');
    const timeElement = bubble.querySelector('.bubble-time');
    
    textElement.textContent = 'Failed to load medical AI news';
    timeElement.textContent = 'Please try refreshing the page';
    
    bubble.classList.remove('hidden');
    setTimeout(() => {
        bubble.classList.add('show');
    }, 100);
}

// 页面加载完成后加载新闻
window.addEventListener('load', () => {
    loadDailyNews();
});

console.log('%c欢迎来到我的个人网站！', 'color: #ff6b9d; font-size: 20px; font-weight: bold;');
console.log('%c如果你对代码感兴趣，欢迎查看源码 😊', 'color: #c77dff; font-size: 14px;');

// 导出函数供其他脚本使用（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMenu,
        updateEyePosition,
        smoothScrollToAnchor
    };
}