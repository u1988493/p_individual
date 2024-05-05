document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mode1').addEventListener('click', 
    function(){
        sessionStorage.removeItem("save");
        window.location.assign("./html/menu.html");
    });

    document.getElementById('mode2').addEventListener('click', 
    function(){
        sessionStorage.removeItem("save");
        window.location.assign("./html/menu2.html");
    });

    
});