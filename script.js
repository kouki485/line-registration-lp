// PAGE読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    // LINE登録ボタンにアクセシビリティを追加
    const lineButtons = document.querySelectorAll('.line-button');
    
    lineButtons.forEach((button, index) => {
        // クリック時のアニメーション効果のみ追加
        button.addEventListener('click', function(e) {
            // アニメーション効果
            const clickedButton = e.target.closest('.line-button');
            if (clickedButton) {
                clickedButton.style.transform = 'translateX(-50%) scale(0.9)';
                setTimeout(() => {
                    clickedButton.style.transform = 'translateX(-50%) scale(1)';
                }, 150);
            }
            
            // HTMLの<a>タグの処理を優先（preventDefault()は削除）
            // elink経由でのリンクはHTMLで処理される
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