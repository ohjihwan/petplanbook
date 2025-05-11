/* LOGO */
var tl = anime.timeline({easing: 'easeOutExpo', duration: 700, loop:true});

tl.add({targets:'.hat', translateX:32, translateY:4, easing: 'easeInExpo', skew:[-22]});
tl.add({targets:'.ac1', skew:[0, -10], rotate:.7});
tl.add({targets:'.hat', skew:[-22, -50], translateX:36, translateY:-6, rotate:20}, '-=700');
tl.add({targets:'.ac1', skew:[-10, 9, -8, 3 , 0], rotate:0}, '-=600');
tl.add({targets:'.hat', skew:0, translateX:54, translateY:-16, rotate:0}, '+=200');
tl.add({targets:'.hat', skew:0, translateX:56, translateY:0, skew:[-10, 10], duration:300});
tl.add({targets:'.ac2', scaleY:[.8,1.15,.9,1]}, '-=200');
tl.add({targets:'.hat', skew:0, translateX:60, translateY:-20, skew:[0, 10], duration:500}, '-=650');
tl.add({targets:'.hat', skew:0, translateX:68, translateY:-15, rotate:0, duration:300});
tl.add({targets:'.hat', skew:0, translateX:68, translateY:-2, duration:300});
tl.add({targets:'.ac3', scaleY:[.9,1.05,.95,1]}, '-=200');
tl.add({targets:'.hat', skew:0, translateX:73, translateY:-15, skew:0, duration:200}, '-=650');
tl.add({targets:'.hat', skew:0, translateX:86, translateY:-14, skew:0, duration:200});
tl.add({targets:'.hat', skew:0, translateX:90, translateY:0, skew:0, duration:200}, '+=500');
tl.add({targets:'.ac4', scaleY:[.95,1,.98,1],}, '-=200');
tl.add({targets:'.hat', skew:[2,-4,3,1,0], translateX:[90,92], translateY:[-2,0,-1,0], duration:300, endDelay: 8000}, '-=600');
tl.add({targets:'.hat', translateY:[11,11,11,11,-12,-20,-30]});
tl.add({targets:'.ac4', scaleY:[.6,.6,.6,.6,1,.95,1],}, '-=680');

/* GUIDE LIST */
document.querySelectorAll('.gl script').forEach(function(script, i, scripts) {
    var item = document.createElement('div');
    var ex = document.createElement('div');
    var html = window['item'+ i] = script.textContent.replace('<!-- [코드시작] -->', '').replace('<!-- [코드끝] -->', '').trim();
    var size = !script.dataset.size ? 1 : script.dataset.size;

    // 아이템
    item.classList.value = script.classList.value;
    item.classList.add('gl__item');
    item.classList.add('-x'+ size);
    item.dataset.title = script.dataset.title;
    if (script.dataset.desc) { item.dataset.desc = script.dataset.desc; }
    if (script.dataset.notes) { item.dataset.notes = script.dataset.notes; }

    // 프리뷰
    ex.classList.add('gl__preview');
    ex.innerHTML = html;
    ex.addEventListener('click', function(e) {
        var target = e.target;

        navigator.clipboard.writeText(html).then(function() {

        });
    });
    item.append(ex);

    script.insertAdjacentElement('afterend', item);
    script.remove();
});

document.querySelectorAll('.gl__item').forEach(function(item, i) {
    item.addEventListener('mouseenter', function(e) {
        var target = e.target;
        var items = document.querySelectorAll('.gl__item');
        var testButton = document.createElement('button');
        var detailButton = document.createElement('button');

        testButton.type = 'button';
        testButton.classList.add('gl__test');
        testButton.innerHTML = '<span>테스트</span>';
        testButton.addEventListener('click', function(e) {
            var cTarget = e.currentTarget;
            var item = cTarget.parentNode;

            item.classList.toggle('test-mode');
        });

        target.append(testButton);

        // 코드보기
        detailButton.type = 'button';
        detailButton.classList.add('gl__detail');
        detailButton.innerHTML = '<span>상세</span>';
        detailButton.addEventListener('click', function(e) {
            var target = e.target;
            var item = target.parentNode;
            var gd = document.createElement('div');
            var title = document.createElement('div');
            var dev = document.createElement('div');
            var code = document.createElement('pre');
            var info = document.createElement('div');
            var close = document.createElement('button');
            var desc = document.createElement('div');
            var subTitle = document.createElement('div');
            var notes = document.createElement('div');

            if (document.querySelector('.gd')) { document.querySelector('.gd').remove(); };

            gd.classList.add('gd');

            title.classList.add('gd__title');
            title.innerText = item.dataset.title;

            gd.append(title);

            code.classList.add('gd__code');
            code.textContent = window['item'+ i];

            dev.classList.add('gd__dev');
            dev.append(code);

            gd.append(dev);

            info.classList.add('gd__info');

            if (item.dataset.desc) {
                desc.classList.add('gd__desc');
                desc.innerHTML = item.dataset.desc;

                info.append(desc);
            }

            if (item.dataset.notes) {
                subTitle.classList.add('gd__sub-title');
                subTitle.innerText = '수정내역';

                info.append(subTitle);

                notes.classList.add('gd__notes');

                item.dataset.notes.replaceAll(/[\{\}/\s/\n]/g, '').split(',').forEach(function(item, i) {
                    var result = item.split(':');
                    var note = document.createElement('div');

                    note.classList.add('gd__note');
                    note.dataset.date = result[0];
                    note.innerHTML = result[1];

                    notes.append(note);
                });

                info.append(notes);
            }

            gd.append(info);

            close.type = 'button';
            close.classList.add('gd__close');
            close.innerHTML = '<span class="hide">닫기</span>';

            gd.append(close);

            document.querySelector('body').append(gd);

            if (item.dataset.desc) { desc = item.dataset.desc; }

            items.forEach(function(item) { item.classList.remove('-active') });
            item.classList.add('-active');

            document.querySelector('.gd').classList.add('-active');

            if (item.dataset.notes) {
                notes = item.dataset.notes;
            }

            if (desc) { document.querySelector('.gd__desc').innerText = desc; }
        });

        target.append(detailButton);
    });

    item.addEventListener('mouseleave', function(e) {
        var target = e.target;
        var testButton = target.querySelector('.gl__test');
        var detailButton = target.querySelector('.gl__detail');

        testButton.remove();
        detailButton.remove();
    });
});

document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('gd__close')) return;

    document.querySelector('.gl__item.-active').classList.remove('-active');
    document.querySelector('.gd').remove();
});

/* NAVIGATION */
document.querySelectorAll('.gn__group > button').forEach(function(button) {
    button.addEventListener('click', function(e) {
        var target = e.target;

        target.parentNode.classList.toggle('-active');
    });
});

var openTimer;
var closeTimer;

document.querySelector('.gn').addEventListener('mouseenter', function(e) {
    clearTimeout(closeTimer);
    navTimer = setTimeout(function() {
        document.querySelector('.gn').classList.add('-active');
    }, 400);
});

document.querySelector('.gn').addEventListener('mouseleave', function(e) {
    clearTimeout(openTimer);
    closeTimer = setTimeout(function() {
        document.querySelector('.gn').classList.remove('-active');
    }, 1000);
});

window.addEventListener('resize', resize);

function resize() {
    if (window.innerWidth <= 1200) {
        document.querySelector('.gn').classList.remove('-active');
    }
}

resize();

/* HEADING SHOW/HIDE */
window.addEventListener('load', function() {
    var body = document.querySelector('body');
    var button = document.querySelector('.gh__util.-heading');
    var keyword = button.querySelector('span');

    if (window.localStorage.getItem('hiddenHeading') == 'true') {
        body.classList.remove('-hidden-heading');
        button.classList.remove('-active');
        keyword.innerText = '제목숨기기';
    } else {
        body.classList.add('-hidden-heading');
        button.classList.add('-active');
        keyword.innerText = '제목보이기';
    }
});

document.querySelector('.gh__util.-heading').addEventListener('click', function(e) {
    var target = e.target;
    var body = document.querySelector('body');
    var keyword = target.querySelector('span');

    if (window.localStorage.getItem('hiddenHeading') == 'true') {
        body.classList.add('-hidden-heading');
        target.classList.add('-active');
        keyword.innerText = '제목보이기';
        window.localStorage.setItem('hiddenHeading', false);
    } else {
        body.classList.remove('-hidden-heading');
        target.classList.remove('-active');
        keyword.innerText = '제목숨기기';
        window.localStorage.setItem('hiddenHeading', true);   
    }
});

/* POINT COLOR */
var pointCount = 1;
var pointIDName;
var pointPrevIDName;

document.querySelector('.gh__util.-point').addEventListener('click', function() {
    var body = document.querySelector('body');

    if ( pointCount < 8 ) {
        pointCount++;
        pointIDName = 'colour'+ pointCount;

        body.id = null;
        body.id = pointIDName;

        pointPrevIDName = pointIDName;
    } else {
        pointCount = 1;

        body.id = null;
    }

});

/* DARK MODE */
document.querySelector('.gh__util.-dark').addEventListener('click', function(e) {
    var target = e.target;
    var body = document.querySelector('body');
    var keyword = target.querySelector('span');

    body.classList.toggle('dark-mode');
    target.classList.toggle('-active');

    if (keyword.innerText === '다크모드') {
        keyword.innerText = '라이트모드';
    } else {
        keyword.innerText = '다크모드';
    }
});

/* NAVIGATION */
var headings = document.querySelectorAll('.gc__heading');

window.addEventListener('scroll', function() {
    var currentID;

    headings.forEach(function(heading) {
        if (pageYOffset === 0) {
            if (document.querySelector('.gn a.-active') !== null) {
                document.querySelector('.gn a.-active').classList.remove('-active');
            }
            
            document.querySelector('.gn a').classList.add('-active');
        }
        if (pageYOffset >= heading.offsetTop - 74) { currentID = heading.id; }
    });

    if (document.querySelector('.gn a.-active')) {
        document.querySelector('.gn a.-active').classList.remove('-active');
    }

    if (document.querySelector('[href="#'+ currentID +'"]') !== null) {
        document.querySelector('[href="#'+ currentID +'"]').classList.add('-active');
    }
});

document.querySelectorAll('.gn a').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var target = e.target;
        var href = target.getAttribute('href');

        window.scrollTo(0, document.querySelector(href).offsetTop - 74);

        e.preventDefault();
    });
});

document.querySelectorAll('.gc button').forEach(function(button) {
    button.addEventListener('click', function(e) {
        var cTarget = e.currentTarget;
        var code;
        var type;

        if (cTarget.dataset.bankcode) {
            type = 'bank';
            code = cTarget.dataset.bankcode;
        } else if (cTarget.dataset.countrycode) {
            type = 'country';
            code = cTarget.dataset.countrycode;
        } else if (cTarget.dataset.brand) {
            type = 'brand';
            code = cTarget.dataset.brand;
        } else if (cTarget.dataset.categorycode) {
            type = 'category';
            code = cTarget.dataset.categorycode;
        }

        navigator.clipboard.writeText('data-'+ type +'code="'+ code +'"').then(function() {

        });
    });
});