// LINE登録ボタンがクリックされたときの処理
function registerLine() {
    // LINE友だち追加URL
    const lineUrl = 'https://lin.ee/MwRdDOk';
    
    // クリック時のアニメーション効果
    const clickedButton = event.target.closest('.line-button');
    if (clickedButton) {
        clickedButton.style.transform = 'translateX(-50%) scale(0.9)';
        setTimeout(() => {
            clickedButton.style.transform = 'translateX(-50%) scale(1)';
        }, 150);
    }
    
    // 直接LINEに遷移
    window.open(lineUrl, '_blank');
    
    // Google Analyticsなどのトラッキングイベントを送信する場合
    // gtag('event', 'click', {
    //     'event_category': 'LINE',
    //     'event_label': 'registration_button'
    // });
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    // すべてのLINE登録ボタンにイベントリスナーを追加
    const lineButtons = document.querySelectorAll('.line-button');
    
    lineButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 実際のLINE登録処理を実行
            registerLine();
        });
        
        // ボタンにキーボードアクセシビリティを追加
        button.setAttribute('tabindex', '0');
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', `LINE登録ボタン ${index + 1}`);
        
        // エンターキーでもクリックできるようにする
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});

// スクロール時の効果（オプション）
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset;
    const buttons = document.querySelectorAll('.line-button');
    
    buttons.forEach((button, index) => {
        const rect = button.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            button.style.opacity = '1';
        }
    });
}); 