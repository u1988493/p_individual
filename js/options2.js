var options2 = function(){
    const default_options2 = {
        level:1,
        difficulty:'normal'
    };
    
    var level = $('#level');
    var difficulty = $('#dif');

    var options2 = JSON.parse(localStorage.options2||JSON.stringify(default_options2));
    level.val(options2.level);
    difficulty.val(options2.difficulty);
    level.on('change',()=>options2.level = level.val());
    difficulty.on('change',()=>options2.difficulty = difficulty.val());

    return { 
        applyChanges: function(){
            localStorage.options2 = JSON.stringify(options2);
        },
        defaultValues: function(){
            options2.level = default_options2.level;
            options2.difficulty = default_options2.difficulty;
            pairs.val(options2.level);
            difficulty.val(options2.difficulty);
        }
    }
}();

$('#default').on('click',function(){
    options2.defaultValues();
});

$('#apply').on('click',function(){
    options2.applyChanges();
    location.assign("../");
});