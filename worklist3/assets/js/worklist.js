// 미리보기 아이프레임 닫기
function iframeClose(){
	$('.iframe-box').removeClass('-on');
	$('.iframe-select').prop('checked',false);
	$('body').removeAttr('style');
	$('.iframe-view').attr('src','');
}
document.addEventListener('DOMContentLoaded', () => {
	// 다크모드 사용자별 초기 설정
	if( window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
		document.querySelector('body').classList.add("darkWorklist")
	} else {
		document.querySelector('body').classList.remove("darkWorklist")
	}

	// 페이지 아이디 복사
	let clipBoard = () => {
		document.querySelectorAll('.clip').forEach(x => {
			x.addEventListener('click', e => {
				 e.stopPropagation();
				 navigator.clipboard.writeText(e.target.parentNode.innerText);
				 anime({
					targets: x,
					easing: 'easeOutQuint',
					duration: 500,
					scale: [1.2, 0.8, 1],
				});
			});
		});
	};

	// 상태(state) 표시
	let stateColor = () => {
		// 상시 버전
		$('.state').each(function(){
			if( $(this).text() == '작업중' ){
				$(this).addClass('work') // .closest('tr').show()
			}
			if( $(this).text() == '확인중' ){
				$(this).addClass('work') // .closest('tr').show()
			}
			if( $(this).text() == '검수' ){
				$(this).addClass('test') // .closest('tr').show()
			}
			if( $(this).text() == '완료' ){
				$(this).addClass('done') // .closest('tr').show()
			}
			if( $(this).text() == '삭제' ){
				$(this).siblings('.func').find('input[type="radio"]').attr('disabled','disabled').closest('tr').addClass('del')
			}
			if( $(this).text() == '확인필요' ){
				$(this).addClass('schedule')
			}
		})
	};

	// 비고 자세히 보기
	let noteHandler = () => {
		$('table td.note').on('click', function (e) {
			iframeClose()

			var cloneNote = $(e.currentTarget.cloneNode(true).children);

			if($('.notes').length > 0) {
				$('.notes').remove();
			};

			var markup	= '<div class="notes">';
				markup += '	<div class="box">';
				markup += '		<button type="button" class="close"></button>';
				markup += '		<div class="title">수정내역</div>';
				markup += '		<div class="list"></div>';
				markup += '	</div>';
				markup += '</div>';

			$('body').append(markup).css({'padding-right':'300px'});
			$('.filter-box').removeClass('-on');

			cloneNote.each((x,y) => $('.notes .list').append(y))
			
			anime({
				targets: '.notes',
				easing: 'easeOutQuint',
				duration: 800,
				translateX: ['100%', 0],
			});
		});

		$(document).on('click', '.notes .close', function (e) {
			$(e.currentTarget).closest('.notes').remove();
			$('body').removeAttr('style');
			$('.filter-box').removeClass('-on');
		});
	}

	clipBoard();
	stateColor();
	noteHandler();
});

$(function(){
	var count = 0;

	$('.iframe-close').on('click', function(){
		iframeClose()
	})
// 미리보기 아이프레임 호출
	$('.iframe-select').on('change',function(){
		$('.notes').remove();
		$('.iframe-box').addClass('-on');
		$('body').css({'padding-right':'377px'});
		let linkHref = $(this).siblings('.linked').attr('href');
		$('.iframe-view').attr('src', ''+linkHref+'');
		setTimeout(() => {
			$('.iframe-select:checked').focus();
		}, 300);
	});

	// 단축키 설정 (중복 사용 키)
	$(document).keypress(function(event){
		// 다크모드 강제 옵션
		if(event.keyCode == 2 ) { /* Ctrl + B */
			$('body').toggleClass('darkWorklist')
		};
		if( event.keyCode === 99) {
			count++;
			setTimeout(function(){
				count = 0;
			}, 500)
			if( count === 2 ) {
				var popP = window.open('worklist/popups/remcalculator.html', 'example', 'width=361, height=147');
				popP.addEventListener('load', function(){
				})
				count = 0;
			}
		}
		// console.log(event.keyCode)
	});
	// 단축키 설정 (개별 사용 키)
	$(document).keyup(function(event){
		if(event.keyCode === 27){ /* ESC */
			if( $('.notes').length ){
				$('.notes').remove();
				$('body').removeAttr('style');
			} else if( $('.iframe-box').hasClass('-on') ){
				iframeClose()
			}
		}
		// console.log(event.keyCode)
	});

	$('.wh__category input[type="radio"][name=category]').on('change', function(){
		let categoryValue = $(this).val()
		$('table tbody tr').show();
		$('tbody').hide();
		$('.'+categoryValue).show();
		if( categoryValue == 'spall' ) {
			$('tbody').show();
		}
	})

	var searchValCheck = [];
	$('.check-input').on('change', function(){
		searchValCheck = [];
		$('.filter-body .check-input:checked').each(function(){
			searchValCheck.push($(this).val());
		})
		$('table tbody tr').hide();
		$('.search-input').val('');

		$('table tbody tr .user').each(function(){
			if( $(this).text() == searchValCheck.join() ) {
				$(this).closest('tr').show();
			}
		});
	});

	$('.search-input').keyup(function(event){
		setTimeout(() => {
			const allTr = [... document.querySelectorAll('table tbody tr')];
			const workSearch = document.querySelector('.search-input');
			const searchArr = allTr.filter( (tr) => 
				tr.innerText.includes( workSearch.value ) 
			);
			if(searchArr.length !== 0) {
				$('table tbody tr').hide()
				$('table tbody tr').each(function(){
					if( $(this).text().indexOf(workSearch.value) !== -1 && workSearch.value != '' ){
						$(this).closest('tr').show();
					}
				});
				$('.none-data-text').hide();
			} else {
				$('.none-data-text').show();
			}
			$('.check-input').prop('checked', false);
		}, 100);
	});
});