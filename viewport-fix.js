// 修复移动端 100vh 问题
// 移动端浏览器的 100vh 包含地址栏高度，导致底部被遮挡
// 通过 JS 获取真实可视高度并设置 CSS 变量
(function() {
    function setAppHeight() {
        var vh = window.innerHeight;
        document.documentElement.style.setProperty('--app-height', vh + 'px');
    }
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    // 处理屏幕旋转
    window.addEventListener('orientationchange', function() {
        setTimeout(setAppHeight, 100);
    });
})();
