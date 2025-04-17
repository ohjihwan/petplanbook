var UI = (function() {
	function throttle(func, limit) {
		var lastFunc;
		var lastRan;

		return function() {
			var context = this;
			var args = arguments;

			if (!lastRan) {
				func.apply(context, args);
				lastRan = Date.now();
			} else {
				clearTimeout(lastFunc);
				lastFunc = setTimeout(function() {
					if ((Date.now() - lastRan) >= limit) {
						func.apply(context, args);
						lastRan = Date.now();
					}
				}, limit - (Date.now() - lastRan));
			}
		}
	}

	function clickable() {
		document.addEventListener('click', function(e) {
			var target = e.target;

			if (target.nodeName === 'BUTTON' || target.nodeName === 'A' || target.closest('button') || target.closest('a')) {
				target.classList.add('clicked');

				setTimeout(function() {
					target.classList.remove('clicked');
				}, 500);
			}

		});
	}

	function tabs() {
		var tabsWidth = 0;
		var scrollWidth = 0;

		document.querySelectorAll('.tabs .item').forEach(function(x) {
			scrollWidth += x.clientWidth;
		});
		console.log(`scrollWidth ${scrollWidth}`)

		document.querySelectorAll('.tabs').forEach(function(tabs) {
			tabsWidth = tabs.clientWidth;
			console.log(`tabsWidth ${tabsWidth}`)

			if (scrollWidth > tabsWidth + 2) {
				tabs.classList.add('-swipe');
			}
		});

		document.addEventListener('click', function(e) {
			if (e.target.getAttribute('role') === 'tab' && e.target.closest('.tabs')) {

				var target = e.target;
				var tablist = target.parentNode.parentNode;
				var inner = tablist.parentNode;
				var items = tablist.children;
				var idx = [].indexOf.call(items ,target.parentNode);
				var activeItem = tablist.querySelector('.-active');
				var id = target.getAttribute('aria-controls');
				var activePanel = document.querySelector('#'+ id);
				var tabPanel = document.querySelector('.tabs-panel')

				var selected = tablist.querySelector('[role="tab"] .hide');

				activeItem.classList.remove('-active');
				if (selected) selected.remove();
				activeItem.querySelector('button').ariaSelected = false;

				if(tabPanel) {
					activePanel.parentNode.querySelectorAll('.tabs-panel').forEach(function(tabs) {
						tabs.tabIndex = -1;
					})
					activePanel.parentNode.querySelector('.tabs-panel.-active').classList.remove('-active');
					activePanel.classList.add('-active');
					activePanel.tabIndex = 0;
				}

				items[idx].classList.add('-active');
				items[idx].querySelector('button').insertAdjacentHTML('beforeend', '<span class="hide">선택됨</span>')
				items[idx].querySelector('button').ariaSelected = true;
			}
		});
	}

	function subs() {
		document.addEventListener('click', function(e) {
			if (e.target.getAttribute('role') === 'tab' && e.target.closest('.subs')) {
				var target = e.target;
				var tablist = target.parentNode.parentNode;
				var items = tablist.children;
				var idx = [].indexOf.call(items ,target.parentNode);
				var activeItem = tablist.querySelector('.-active');
				var id = target.getAttribute('aria-controls');
				var activePanel = document.querySelector('#'+ id);

				var selected = tablist.querySelector('[role="tab"] .hide');

				activeItem.classList.remove('-active');
				if (selected) selected.remove();
				activeItem.querySelector('button').ariaSelected = false;

				activePanel.parentNode.querySelectorAll('.subs-panel').forEach(function(tabs) {
					tabs.tabIndex = -1;
				})

				items[idx].classList.add('-active');
				items[idx].querySelector('button').insertAdjacentHTML('beforeend', '<span class="hide">선택됨</span>')
				items[idx].querySelector('button').ariaSelected = true;

				activePanel.parentNode.querySelector('.subs-panel.-active').classList.remove('-active');
				activePanel.classList.add('-active');
				activePanel.tabIndex = 0;
			}
		});
	}

	function segments() {
		document.addEventListener('click', function(e) {

			if (e.target.getAttribute('role') === 'tab' && e.target.closest('.segments')) {
                var target = e.target;
                var tablist = target.parentNode.parentNode;
                var items = tablist.children;
                var idx = [].indexOf.call(items ,target.parentNode);
                var activeItem = tablist.querySelector('.-active');
                var id = target.getAttribute('aria-controls');
                var activePanel = document.querySelector('#'+ id);

                var selected = tablist.querySelector('[role="tab"] .hide');
				var segmentList = target.closest('.segments');
				var segmentPanel = segmentList.nextElementSibling;
				var segmentContent = segmentPanel.querySelectorAll('.segments-panel');

                activeItem.classList.remove('-active');
                if (selected) selected.remove();
                activeItem.querySelector('button').ariaSelected = false;

				items[idx].classList.add('-active');
                items[idx].querySelector('button').insertAdjacentHTML('beforeend', '<span class="hide">선택됨</span>')
                items[idx].querySelector('button').ariaSelected = true;

				if(items.length === segmentContent.length) {
					segmentContent.forEach(function(tab, i){
						if(id !== tab.id) {
							tab.classList.remove('-active');
							activePanel.tabIndex = -1;
						} else {
							tab.classList.add('-active');
							activePanel.tabIndex = 0;
						}
					})
				} else {
					if(segmentContent) {
						segmentContent.forEach(function(tab, i){
							if(id === tab.id) {
								tab.classList.add('-active');
								activePanel.tabIndex = 0;
								if(tab.parentNode.nextElementSibling) {
									tab.parentNode.nextElementSibling.classList.add('mt-15')
								}
							} else {
								tab.classList.remove('-active');
								tab.tabIndex = -1;
							}
						})
					}
				}
            }
		});
	}

	function tooltip() {
		var close = document.createElement('button');

		document.addEventListener('click', function(e) {
			if (e.target.classList.contains('trigger') === false) return;

			e.stopPropagation();

			var target = e.target;
			var parent = target.parentNode;
			var panel = parent.querySelector('.panel');
			var tooltips = document.querySelectorAll('.tooltip');
			var isOpen = parent.classList.contains('-active');

			// 24.03.08 contents contains title class added
			var panelConts = panel.querySelectorAll('span');
			panelConts.forEach(function(e){
				if(e.classList.contains('title')) {
					e.parentNode.classList.add('withTitle');
				}
			});

			var root = target.closest('.container').parentNode;
			var rootID = root.id;

			var isPage = root.classList.contains('page');
			var isPopup = root.classList.contains('popup');
			var isLayer = root.classList.contains('layer');
			var isAlert = root.classList.contains('alert');

			var fixerHeight = root.querySelector('.fixer') !== null ? parseInt(window.getComputedStyle(root.querySelector('.fixer')).height) : parseInt(window.getComputedStyle(root.querySelector('.content')).paddingBottom);
			var bufferOffsetTop = root.querySelector('.buffer') !== null ? root.querySelector('.buffer').offsetTop : 0;
			var bufferMarginTop = root.querySelector('.buffer') !== null ? parseInt(window.getComputedStyle(root.querySelector('.buffer')).height) : 0;
			var stickerMarginTop = root.querySelector('.sticker') !== null ? parseInt(window.getComputedStyle(root.querySelector('.sticker')).marginTop) : 0;

			var comparePageHeight = document.documentElement.scrollHeight - (e.pageY - e.offsetY) - fixerHeight;
			var halfCompareHeight = Math.floor((document.documentElement.scrollHeight - parseInt(window.getComputedStyle(root).height)) / 2);
			var alertCompareHeight = document.documentElement.scrollHeight - (e.pageY - e.offsetY) - halfCompareHeight - fixerHeight;

			var compareBufferHeight = isPage ? Math.abs(document.documentElement.scrollHeight - bufferOffsetTop - bufferMarginTop - stickerMarginTop) : 0;

			if (!isOpen) {
				var gutter = isAlert ? 48 : 24;

				anime({
					targets: panel,
					easing: 'easeOutCirc',
					duration: 400,
					opacity: [0, 1],
					translateY: ['30%', 0],
					begin: function() {
						if (isLayer) {
							if (parseInt(window.getComputedStyle(root).height) >= window.innerHeight - 60) {
								if (e.clientY > parseInt(document.documentElement.clientHeight - (document.documentElement.clientHeight / 2.8))) parent.classList.add('-reversed');
							}
						} else {
							if (e.clientY > parseInt(document.documentElement.clientHeight - (document.documentElement.clientHeight / 2.8))) parent.classList.add('-reversed');
						}

						tooltips.forEach(function(tooltip) {tooltip.classList.remove('-active')})
						parent.classList.add('-active');
						panel.style.left = (e.pageX - e.offsetX - gutter) * -1 + 'px';
						panel.style.width = 'calc(100vw - '+ (gutter / 10) * 2 + 'rem)';

						close.type = 'button';
						close.classList.add('close');
						close.innerHTML = '<span class="hide">닫기</span><i class="icons-close" aria-hidden="true"></i>';
						panel.append(close);

						var panelTop = Math.floor(parseFloat(window.getComputedStyle(panel).top));
						var targetHeight = Math.floor(parseFloat(window.getComputedStyle(target).height));
						var tooltipHeight = Math.floor(parseFloat(window.getComputedStyle(panel).height));
						var tooltipTotalHeight = tooltipHeight + panelTop + targetHeight + compareBufferHeight;
						var heightProfit = Math.abs(comparePageHeight - tooltipTotalHeight);
						var alertHeightProfit = Math.abs(alertCompareHeight - tooltipTotalHeight);

						function pageBuffer() {
							if (tooltipTotalHeight >= comparePageHeight) {
								buffer.add(heightProfit);
							}
						}

						function popupLayerBuffer() {
							if (isPopup && tooltipTotalHeight >= comparePageHeight) {
								window[root.id].buffer.add(heightProfit)
							}

							if (isLayer && tooltipTotalHeight >= comparePageHeight) {
								layer.buffer.add(heightProfit);
							}
						}

						function alertBuffer() {
							if (tooltipHeight >= alertCompareHeight) {
								alert.buffer.add(alertHeightProfit);
							}
						}

						if (isPage) {
							pageBuffer();
						} else {
							if (isLayer || isPopup) {
								popupLayerBuffer();
							}

							if (isAlert) {
								alertBuffer();
							}
						}

						close.addEventListener('click', function(event) {
							event.stopPropagation();
							event.target.closest('.tooltip').querySelector('.trigger').click();
						}, true);
					}
				});
			} else {

				anime({
					targets: panel,
					easing: 'easeOutCirc',
					duration: 100,
					opacity: [1, 0],
					translateY: [0, '30%'],
					complete: function() {
						parent.classList.remove('-active');
						parent.classList.remove('-reversed');
						panel.removeAttribute('style');
						close.remove();
					}
				});

				function pageBufferRevert() {
					if (buffer.isEdited == true) {
						buffer.revert();
					};
				};

				function popupLayerBufferRevert() {
					if (isPopup && window[root.id].buffer.isEdited == true) {
						window[root.id].buffer.revert();
					};

					if (isLayer && layer.buffer.isEdited == true) {
						layer.buffer.revert();
					};
				};

				function alertBufferRevert() {
					if (isAlert && alert.buffer.isEdited == true) {
						alert.buffer.revert();
					};
				};

				if (isPage) {
					pageBufferRevert();
				} else {
					if (isLayer || isPopup) {
						popupLayerBufferRevert();
					};

					if (isAlert) {
						alertBufferRevert();
					};
				};
			};
		}, true);
	}

	/*
		# 개발요청건
		  아이프레임 리사이즈는 개발파트에서 처리하지만 아코디언이 닫혀있는 경우에는
		  아이프레임의 높이를 구하는 과정에서 UI를 열고 닫는 등의 컨트롤이 필요해
		  아코디언(data-role="fold") 내부의 아이프레임 리사이즈만 퍼블리싱파트에서 처리하기로 협의
	*/
	function iframe(selector) {
		var root = document.querySelector(selector);

		if (!root) return;

		var hiddenItems = root.querySelectorAll('[data-role="hidden"]');

		[].forEach.call(hiddenItems, function(x) {
			if (!x.querySelector('iframe')) return;

			var iframes = x.querySelectorAll('iframe');

			[].forEach.call(iframes, function(y, z) {
				x.classList.add('calculate');
				y.src = y.src;
				y.addEventListener('load', function(e) {
					var path = e.path || e.composedPath();

					this.style.height = path[0].contentDocument.documentElement.scrollHeight + 'px';

					if (iframes.length - 1 === z) {
						this.closest('[data-role="hidden"]').classList.remove('calculate');
					}
				});
			});
		});
	}

	// 240910 iframe resize 
	function iFrameHeight() {
		var iframeSelector = document.querySelectorAll('.inline-iframe');
		iframeSelector.forEach(function(e){
			function clientObserver() {
				function iframeMutation(entries) {
					entries.forEach(function(entry) {
						var offsetH = entry.target.clientHeight;
						e.style.height = `${offsetH}px`;
						resizeObserver.disconnect();
					})
				}
				var resizeObserver = new ResizeObserver(iframeMutation);
				resizeObserver.observe(e);		
			}

			function resizeH() {
				setTimeout(function(){
					var offsetH = e.contentWindow.document.body.clientHeight;
					e.style.height = `${offsetH}px`;
					clientObserver();
				}, 300);	
			}
			var events = ['load', 'resize'];
			for(el of events) {
				window.addEventListener(el, resizeH);
			}
		})
	}
	
    /* 검증,운영버전이랑 내용 다르니 반드시 교체하고 이행할것 */
	function inIframe() {
		if(!window.location.host) {
			if (window) {
				if (window.document.querySelector('body')) {
					if (window.document.querySelector('body').classList.contains('dark-mode') === true) {
						document.querySelector('body').classList.add('dark-mode');
					}
				}
			}
		} else {
			if (window.parent) {
				if (window.parent.document.querySelector('body')) {
					if (window.parent.document.querySelector('body').classList.contains('dark-mode') === true) {
						document.querySelector('body').classList.add('dark-mode');
					}
				}
			}
		}
	}
	/* // */
    // function inIframe() {
    //     if (window.parent) {
    //         if (window.parent.document.querySelector('body')) {
    //             if (window.parent.document.querySelector('body').classList.contains('dark-mode') === true) {
    //                 document.querySelector('body').classList.add('dark-mode');
    //             }
    //         }
    //     }
    // }

	function fold() {
		document.addEventListener('click', function(e) {
			if (!e.target.closest('[data-role="fold"] [data-role="marker"]')) return;

			var target = e.target;
			var fold = target.closest('[data-role="fold"]');
			var isOpen = fold.classList.contains('-active');
			var foldSize;
			var unfoldSize;
			var contentsScrollTop = e.target.closest('.contents').scrollTop;
			var documentScrollTop = document.documentElement.scrollTop;

			if (!isOpen) {
				foldSize = fold.offsetHeight;

				fold.classList.add('-slidedown');

				unfoldSize = fold.offsetHeight;

				var hiddenItems = fold.querySelectorAll('[data-role="hidden"]');
				var duration = 350;
				var delay = 30;

				anime({
					targets: hiddenItems,
					easing: 'linear',
					duration: duration,
					delay: anime.stagger(delay),
					opacity: [0, 1],
					complete: function() {
						hiddenItems.forEach(function(item) {
							item.removeAttribute('style');
						});
					}
				});

				anime({
					targets: fold,
					easing: 'linear',
					duration: duration + (delay * hiddenItems.length) - delay,
					height: [foldSize, unfoldSize],
					complete: function() {
						fold.classList.remove('-slidedown')
						fold.classList.add('-active')
						fold.removeAttribute('style');

						isClose = false;
					}
				});

				if (fold.classList.contains('notice')) {
					anime({
						targets: document.querySelector('.popup') ? e.target.closest('.contents') : document.documentElement,
						easing: 'linear',
						duration: duration,
						scrollTop: document.querySelector('.popup') ? contentsScrollTop + 200 : documentScrollTop + 200,
					});
				};

			} else {
				var hiddenItems = fold.querySelectorAll('[data-role="hidden"]');
				var duration = 350;
				var delay = 80;

				if (!foldSize) {
					fold.classList.remove('-active');
					foldSize = fold.offsetHeight;
					fold.classList.add('-active');
				}

				unfoldSize = fold.offsetHeight;

				fold.classList.remove('-active')
				fold.classList.add('-slideup');

				anime({
					targets: hiddenItems,
					easing: 'linear',
					height: {
						value: 0,
						duration: duration
					},
					opacity: {
						value: 0,
						duration: duration / 2
					},
					delay: anime.stagger(delay, {direction: 'reverse'}),
				});

				anime({
					targets: fold,
					easing: 'linear',
					duration: duration + (delay * hiddenItems.length) - delay,
					height: [unfoldSize, foldSize],
					complete: function() {
						fold.classList.remove('-slideup')
						fold.removeAttribute('style');

						hiddenItems.forEach(function(item) {
							item.removeAttribute('style');
						});

						isClose = true;
					}
				});

				if (fold.classList.contains('notice')) {
					anime({
						targets: document.querySelector('.popup') ? e.target.closest('.contents') : document.documentElement,
						easing: 'linear',
						duration: duration,
						scrollTop: document.querySelector('.popup') ? [contentsScrollTop, contentsScrollTop] : [documentScrollTop, documentScrollTop]
					});
				};
			}
		});
	}

	function a11y() {
		document.querySelectorAll('[role="tablist"] .item.-active button').forEach(function(tab) {
			if (!tab.querySelector('.hide')) {
				tab.insertAdjacentHTML('beforeend', '<span class="hide">선택됨</span>');
			}

			tab.ariaSelected = true;
		});

		document.querySelectorAll('[aria-controls]').forEach(function(tab) {
			var id = tab.getAttribute('aria-controls');
			var activePanel = document.querySelector('#'+ id);

			if (activePanel) {
				if (activePanel.classList.contains('-active')) { activePanel.tabIndex = 0; }
				if (!activePanel.classList.contains('-active')) { activePanel.tabIndex = -1; }
			}
		});

		document.querySelectorAll('hr').forEach(function(hr) {
			if (hr) {
				hr.ariaHidden = true;
				hr.tabIndex = '-1';
			}
		});

		document.querySelectorAll('.visual-box img').forEach(function(image) {
			if (image) {
				if (image.alt === '') {
					image.ariaHidden = true;
					image.tabIndex = '-1';
				}
			}
		});

		document.querySelectorAll('.filter-bar button').forEach(function(filterBar) {
			if (filterBar) {
				filterBar.insertAdjacentHTML('afterbegin', '<span class="hide">조건 검색하기,</span>');
			}
		});
	}
	
	function initTextfield() {
		document.querySelectorAll('.text input, .textarea textarea').forEach(function(textfield) {
			var id = textfield.id || textfield.dataset.id;
			var label = document.querySelector('label[for="'+ id +'"]');
			var mixContainer = textfield.closest('.mix');
			
			if (textfield.readOnly === true) {
				textfield.parentNode.classList.add('-readonly');

				//240227 readonly condition added
				if (label) {
					if(mixContainer) {
						var textBox = mixContainer.querySelectorAll('.text');
						var readOnlyLength = mixContainer.querySelectorAll('.-readonly');
						if(textBox.length === readOnlyLength.length) {
							label.classList.add('-readonly');
						}
					} else {
						label.classList.add('-readonly');
					}
				}
				
			}
			if (textfield.disabled === true) {
				if (label) {label.classList.add('-disabled');}
				textfield.parentNode.classList.add('-disabled');
			}

			if (textfield.value.length === 0) {
				if (label) {label.classList.add('-textless');}
				textfield.parentNode.classList.add('-textless');
			}

			if (textfield.classList.contains('right') || textfield.classList.contains('left-right')) {
				textfield.parentNode.classList.add('-unit');
			}

			//240313 fieldWrap doesn't exist case
			if(textfield.closest('.field') === null) {
				var createField = document.createElement('div');
				createField.classList.add('field');
				var textParent = textfield.parentNode;
				
				if(mixContainer) {
					var mixParent = mixContainer.parentNode;
					mixParent.replaceChild(createField, mixContainer);
					createField.appendChild(mixContainer);
					mixParent = createField;

					var textField = mixParent.nextElementSibling;
					if(textField) {
						mixParent.appendChild(textField);
					}
				} else {
					var oldParent = textParent.parentNode;
					oldParent.replaceChild(createField, textParent);
					createField.appendChild(textParent);
				}
			}

			textfield.addEventListener('focusin', function(e) {
				var target = e.target;
				var isReadonly = target.readOnly;
				var mix = target.closest('.mix');
				var fieldWrap = target.closest('.field');
				var pLabel = fieldWrap.querySelector('p');
				var labelGroup = fieldWrap.querySelector('.label-group');

				if (label) {
					label.classList.add('-focused');
					if(mix) {
						if(!mix.classList.contains('-half')) {mix.classList.add('-focused');}
						var mixLabel = mix.previousElementSibling;
						if(mixLabel !== null && mixLabel.nodeName === "LABEL") {
							mixLabel.classList.add('-focused');         
						} else if(labelGroup) {
							labelGroup.classList.add('-focused');
						} else if(pLabel && pLabel.classList.contains('label')) {
							pLabel.classList.add('-focused');
						}
						if(mix.classList.contains('allReadOnly')) {
							mixLabel.classList.remove('-focused') || labelGroup.classList.remove('-focused') || labelGroup.querySelector('label').classList.remove('-focused');
						}
					}
				} else if(pLabel) {
					if(pLabel.classList.contains('label')) {
						pLabel.classList.add('-focused');
						if(mix) {
							mix.classList.add('-focused');
						}
					}
				} else {
					if(mix && !mix.classList.contains('-half')){
						mix.classList.add('-focused');
					}
				}
	
				if (!isReadonly) {
					target.parentNode.classList.add('-focused');
				}
			})

			textfield.addEventListener('focusout', function(e) {
				var target = e.target;
				var id = target.id || target.dataset.id;
				var label = document.querySelector('[for="'+ id +'"]');
				var isReadonly = target.readOnly;
				var mix = target.closest('.mix');
				var fieldWrap = target.closest('.field');
				var pLabel = fieldWrap.querySelector('p');
				var labelGroup = fieldWrap.querySelector('.label-group');
				
				if (label) {
					label.classList.remove('-focused');
					if(mix) {
						mix.classList.remove('-focused');
						var mixLabel = mix.previousElementSibling;
						if(mixLabel !== null && mixLabel.nodeName === "LABEL") {
							mixLabel.classList.remove('-focused');         
						} else if(labelGroup) {
							labelGroup.classList.remove('-focused');
						} else if(pLabel && pLabel.classList.contains('label')) {
							pLabel.classList.remove('-focused');
						}
					}
				} else if(pLabel) {
					if(pLabel.classList.contains('label')) {
						pLabel.classList.remove('-focused');
						if(mix) {
							mix.classList.remove('-focused');
						}
					}
				} else {
					if(mix && !mix.classList.contains('-half')){
						mix.classList.remove('-focused');
					}
				}
	
				if (!isReadonly) {
					target.parentNode.classList.remove('-focused');
				}
			});
		});
	}

	function otherTextfield() {
		document.addEventListener('click', function(e) {
			if (!e.target.parentNode.classList.contains('dd-code')) return;

			var target = e.target;
			var targetID = target.id || target.dataset.id;
			var root = target.closest('.container').parentNode;
			var rootID = root.id;
			var contents = root.querySelector('.contents');
			var label = document.querySelector('[for="'+ targetID +'"]');
			var targetOffset = label ? label.getBoundingClientRect().top : target.getBoundingClientRect().top;
			var targetScrollTop;
			var scrollTarget;

			if (root.classList.contains('page'))  {
				scrollTarget = document.documentElement;
				targetScrollTop = scrollTarget.scrollTop + targetOffset - information.upperHeight;
			} else {
				scrollTarget = contents;
				targetScrollTop = scrollTarget.scrollTop + targetOffset - window[rootID].information.upperHeight;
			}

			anime({
				targets: scrollTarget,
				duration: 400,
				easing: 'linear',
				scrollTop: targetScrollTop
			});
		});

		document.addEventListener('focusin', function(e) {
			if (!e.target.parentNode.classList.contains('dd-code')) return;

			var target = e.target;
			var isReadonly = target.readOnly;
			var root = target.closest('.container').parentNode;
			var rootID = root.id;
			var contents = root.querySelector('.contents');
			var fixer = [].filter.call(contents.children, function(x) { return x.classList.contains('fixer'); })[0];
			var isPage = root.classList.contains('page');
			var isPopup = root.classList.contains('popup');
			var isLayer = root.classList.contains('layer');
			var isAlert = root.classList.contains('alert');

			if (!isReadonly) {
				if (fixer) {
					if (isPage) {
						setTimeout(function() {
							if (root.scrollHeight > root.offsetHeight) {
								fixer.classList.add('position-static');
								buffer.set(0);
							} else {
								fixer.classList.add('position-absolute');
							}
						}, 200);
					}

					if (isPopup) {
						setTimeout(function() {
							if (contents.scrollHeight > contents.offsetHeight) {
								fixer.classList.add('position-static');
								window[rootID].buffer.set(0);
							} else {
								fixer.classList.add('position-absolute');
							}
						}, 200);
					}

					if (isLayer) {
						fixer.classList.add('position-static');
						window[rootID].buffer.set(0);
					}

					if (isAlert) {
						fixer.classList.add('position-static');
						window[rootID].buffer.set(0);
					}
				}
			}
		});

		document.addEventListener('focusout', function(e) {
			if (!e.target.parentNode.classList.contains('dd-code')) return;

			var target = e.target;
			var isReadonly = target.readOnly;
			var root = target.closest('.container').parentNode;
			var rootID = root.id;
			var contents = root.querySelector('.contents');
			var fixer = [].filter.call(contents.children, function(x) { return x.classList.contains('fixer'); })[0];
			var isPage = root.classList.contains('page');
			var isPopup = root.classList.contains('popup');
			var isLayer = root.classList.contains('layer');
			var isAlert = root.classList.contains('alert');

			if (!isReadonly) {
				if (fixer) {
					if (isPage) {
						setTimeout(function() {
							if (root.scrollHeight > root.offsetHeight) {
								fixer.classList.remove('position-static');
								buffer.revert();
							} else {
								fixer.classList.remove('position-absolute');
							}
						}, 200)
					}

					if (isPopup) {
						setTimeout(function() {
							if (contents.scrollHeight > contents.offsetHeight) {
								fixer.classList.remove('position-static');
								window[rootID].buffer.revert();
							} else {
								fixer.classList.remove('position-absolute');
							}
						}, 200)
					}

					if (isLayer) {
						fixer.classList.remove('position-static');
						window[rootID].buffer.revert();
					}

					if (isAlert) {
						fixer.classList.remove('position-static');
						window[rootID].buffer.revert();
					}
				}
			}
		});
	}


	function textfield() {
		document.addEventListener('input', function(e) {
			if ((e.target.parentNode.classList.contains('text') || e.target.parentNode.classList.contains('textarea')) === false) return;
			
			var target = e.target;
			var id = target.id || target.dataset.id;
			var links = document.querySelectorAll('#'+ id +', [data-id="'+ id +'"]');
			var label = document.querySelector('label[for="'+ id +'"]');
			var isTextless = [].slice.call(links).every(function(item) {return item.value.length !== 0});

			if (label) {
				if (isTextless === true)  {label.classList.remove('-textless');}
				if (isTextless === false) {label.classList.add('-textless');}
			}

			if (target.value.length !== 0) {
				target.parentNode.classList.remove('-textless');

				if (target.parentNode.querySelector('.clear')) {
					target.parentNode.querySelector('.clear').style.zIndex = 1;
				}
			}

			if (target.value.length === 0) {
				target.parentNode.classList.add('-textless');
			}
		});

		document.addEventListener('focusin', function(e) {
			if ((e.target.parentNode.classList.contains('text') || e.target.parentNode.classList.contains('textarea')) === false) return;

			var target = e.target;
			var id = target.id || target.dataset.id;
			var label = document.querySelector('[for="'+ id +'"]');
			var isClear = target.parentNode.dataset.clear ? false: true;
			var isReadonly = target.readOnly;
			var root = target.closest('.container').parentNode;
			var rootID = root.id;
			var contents = root.querySelector('.contents');
			var fixer = [].filter.call(contents.children, function(x) { return x.classList.contains('fixer'); })[0];
			var isPage = root.classList.contains('page');
			var isPopup = root.classList.contains('popup');
			var isLayer = root.classList.contains('layer');
			var isAlert = root.classList.contains('alert');
		
			if (isClear && !target.parentNode.querySelector('.clear') && !isReadonly) {
				var clear = document.createElement('button');
				clear.classList.add('clear');
				clear.type = 'button';
				clear.innerHTML = '<div class="hide">초기화</div>';
				clear.addEventListener('click', function(e) {
					e.stopPropagation();
					var target = e.target;

					target.parentNode.classList.add('-textless');
					target.parentNode.querySelectorAll('input, textarea')[0].value = null;
					target.parentNode.querySelectorAll('input, textarea')[0].focus();

					if (label) {label.classList.add('-textless')}
					if (target.parentNode.querySelector('.text-count .count')) {
						target.parentNode.querySelector('.text-count .count').innerText = 0;
					}
				});

				target.parentNode.append(clear);
			}

			if (target.parentNode.querySelector('.clear')) {
				target.parentNode.querySelector('.clear').style.zIndex = 1;
			}

			if (!isReadonly) {
				if (fixer) {
					if (isPage) {
						setTimeout(function() {
							if (root.scrollHeight > root.offsetHeight) {
								fixer.classList.add('position-static');
								buffer.set(0);
							} else {
								fixer.classList.add('position-absolute');
							}
						}, 200);
					}

					if (isPopup) {
						setTimeout(function() {
							if (contents.scrollHeight > contents.offsetHeight) {
								fixer.classList.add('position-static');
								window[rootID].buffer.set(0);
							} else {
								fixer.classList.add('position-absolute');
							}
						}, 200);
					}

					if (isLayer) {
						fixer.classList.add('position-static');
						window[rootID].buffer.set(0);
					}

					if (isAlert) {
						fixer.classList.add('position-static');
						window[rootID].buffer.set(0);
					}
				}
			}
		});

		document.addEventListener('focusout', function(e) {
			if ((e.target.parentNode.classList.contains('text') || e.target.parentNode.classList.contains('textarea')) === false) return;

			var target = e.target;
			var id = target.id || target.dataset.id;
			var label = document.querySelector('[for="'+ id +'"]');
			var isReadonly = target.readOnly;
			var root = target.closest('.container').parentNode;
			var rootID = root.id;
			var contents = root.querySelector('.contents');
			var fixer = [].filter.call(contents.children, function(x) { return x.classList.contains('fixer'); })[0];
			var isPage = root.classList.contains('page');
			var isPopup = root.classList.contains('popup');
			var isLayer = root.classList.contains('layer');
			var isAlert = root.classList.contains('alert');

			if (target.parentNode.querySelector('.clear')) {
				setTimeout(function() {
					target.parentNode.querySelector('.clear').style.zIndex = -1;
				}, 100)
			}

			if (!isReadonly) {
				if (fixer) {
					if (isPage) {
						setTimeout(function() {
							if (root.scrollHeight > root.offsetHeight) {
								fixer.classList.remove('position-static');
								buffer.revert();
							} else {
								fixer.classList.remove('position-absolute');
							}
						}, 200)
					}

					if (isPopup) {
						setTimeout(function() {
							if (contents.scrollHeight > contents.offsetHeight) {
								fixer.classList.remove('position-static');
								window[rootID].buffer.revert();
							} else {
								fixer.classList.remove('position-absolute');
							}
						}, 200)
					}

					if (isLayer) {
						fixer.classList.remove('position-static');
						window[rootID].buffer.revert();
					}

					if (isAlert) {
						fixer.classList.remove('position-static');
						window[rootID].buffer.revert();
					}
				}
			}
		});

		document.addEventListener('click', function(e) {
			if ((e.target.parentNode.classList.contains('text') || e.target.parentNode.classList.contains('textarea')) === false) return;
			if (e.target.readOnly) return;
			if (e.target.parentNode.dataset.scroll === 'false') return;

			var target = e.target;
			var targetID = target.id || target.dataset.id;
			var root = target.closest('.container').parentNode;
			var rootID = root.id;
			var contents = root.querySelector('.contents');
			var content = root.querySelector('.content');
			var label = document.querySelector('[for="'+ targetID +'"]');
			var targetOffset = label ? label.getBoundingClientRect().top : target.getBoundingClientRect().top;
			var targetScrollTop;
			var scrollTarget;

			if (root.classList.contains('page'))  {
				scrollTarget = document.documentElement;
				targetScrollTop = scrollTarget.scrollTop + targetOffset - information.upperHeight;
			} else {
				scrollTarget = contents;
				targetScrollTop = scrollTarget.scrollTop + targetOffset - window[rootID].information.upperHeight;
			}

			anime({
				targets: scrollTarget,
				duration: 100,
				easing: 'linear',
				scrollTop: targetScrollTop
			});
		});
	}

	function selectOption() {
		//240222 select button focus set
		var selectBox = document.querySelectorAll('.select');
		selectBox.forEach(function(e){
			var selectCombo = e.parentNode;		
			var eleLength = selectCombo.getElementsByTagName('div');
			var comboBtn = e.querySelector('button');
			var selectLabel = e.previousElementSibling;
			var comboLabel = selectCombo.previousElementSibling;
			var spanText = comboBtn.querySelector('span');
			var valueSpan = document.createElement('span');
			valueSpan.classList.add('btnValue', 'selectSetText');
			valueSpan.innerHTML = comboBtn.innerHTML;

			if(comboBtn.classList.contains('btn-select') && !selectCombo.classList.contains('field')) {
				comboBtn.classList.remove('btn-select', 'btn');
				comboBtn.classList.add('button');
				var fieldWrap = document.createElement('div');
				fieldWrap.classList.add('field');
				fieldWrap.innerHTML = e.outerHTML;
				e.parentNode.replaceChild(fieldWrap, e)
			}

			if(selectCombo.classList.contains('mix')) {
				if(eleLength.length-1 === 0) {
					e.classList.add('-onlyChild');
				} else if(e.nextElementSibling === null || e.nextElementSibling.nodeName === "P") {
					e.classList.add('-lastChild');
				} else if (e.previousElementSibling === null) {
					e.classList.add('-firstChild');
				} else {
					e.classList.add('-nthChild');
				}
				
				comboBtn.addEventListener('focusin', function(ele){
					selectCombo.classList.add('-focused');
					var btnTarget = ele.target;
					btnTarget.parentNode.classList.add('-focused');
					if(comboLabel !== null && comboLabel.tagName === "LABEL") {
						comboLabel.classList.add('-focused');
					}
				}) 
				
				comboBtn.addEventListener('focusout', function(ele){
					selectCombo.classList.remove('-focused');
					var btnTarget = ele.target;
					btnTarget.parentNode.classList.remove('-focused');
					if(comboLabel !== null && comboLabel.tagName === "LABEL") {comboLabel.classList.remove('-focused');}
				}) 
			} else if(selectLabel !== null) {
				if((selectLabel.tagName === "P" ||  selectLabel.tagName === "LABEL") && selectLabel.classList.contains('label')) {
					comboBtn.addEventListener('focusin', function(ele){
						var btnTarget = ele.target;
						btnTarget.parentNode.classList.add('-focused');
						btnTarget.parentNode.previousElementSibling.classList.add('-focused');
					})
	
					comboBtn.addEventListener('focusout', function(ele){
						var btnTarget = ele.target;
						btnTarget.parentNode.classList.remove('-focused');
						btnTarget.parentNode.previousElementSibling.classList.remove('-focused');
					})
				}
			}

			if(spanText) {
				if(spanText.classList.length === 0) {
					spanText.classList.add('btnValue', 'selectSetText');
				} else if(spanText.classList.contains('sub')) {
					comboBtn.innerHTML = '';
					comboBtn.appendChild(valueSpan);
				}
			} else if(!spanText) {
				comboBtn.innerHTML = '';
				comboBtn.appendChild(valueSpan);
			} 

			// 240402 add eventlistener for select value mutation 
			var config = {attributes: true, childList: true, subtree: true}

			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if(mutation.type == 'childList') {
						if(comboBtn.firstChild.nodeType === 3) {
							comboBtn.innerHTML = `<span class="btnValue selectSetText">${comboBtn.innerHTML}</span>`;
						}
					}
					observer.disconnect();
				})
			})
			observer.observe(e, config);

			comboBtn.addEventListener('click', function(ele) {
				observer.observe(e, config);
			});
		});
	}

	function header() {
		var roots = document.querySelectorAll('.page, .popup');

		if (roots) {
			roots.forEach(function(root) {
				var container = root.children[0];
				var header = container.querySelector('.header');

				if (header) {
					var isTitle = header.querySelector('.title') ? true : false;
					var isTitleShow = isTitle && header.querySelector('.title').querySelector('.hide') ? true : false;
					var hasFunc = header.querySelectorAll('.func').length > 0 ? true : false;

					if (isTitleShow && !hasFunc) {
						root.classList.add('-transparent');
					}
				} else {
					root.classList.add('-no-header');
				}
			});
		}
	}

	/* --- */

	function init() {
		window['stack'] = new Stack();

		if (document.querySelector('.page')) {
			window['buffer'] = new Buffer('.page');
			window['information'] = new Information('.page');
		}

		iframe('.page');
		inIframe();
		clickable();
		header();
		tabs();
		subs();
		segments();
		tooltip();
		fold();
		initTextfield();
		textfield();
		selectOption();
		otherTextfield();
		a11y();
		mixForm();
		switchLabelGroup();
		segmentControls();
		agreeComp();
		accSelector();
		iFrameHeight();
	}

	function Information(selector) {
		if (document.querySelector(selector) == (null || undefined)) return;

		var target = document.querySelector(selector);
		var header = target.querySelector('.header');
		var tabs = target.querySelector('.tabs');
		var subs = target.querySelector('.subs');
		var fix = target.querySelector('[data-role="fix"]');
		var content = target.querySelector('.content');
		var headerHeight = header ? header.getBoundingClientRect().height : 0;
		var tabsHeight = tabs ? tabs.getBoundingClientRect().height : 0;
		var subsHeight = subs ? subs.getBoundingClientRect().height : 0;
		var fixHeight = fix ? fix.getBoundingClientRect().height : 0;
		var contentPaddingTop = content ? parseInt(window.getComputedStyle(content).paddingTop): 0;
		var upperHeight;
		var obj = {};

		if (target.classList.contains('page')) {
			upperHeight = headerHeight + tabsHeight + subsHeight + contentPaddingTop + fixHeight;
		}

		if (target.classList.contains('popup')) {
			upperHeight = headerHeight + tabsHeight + contentPaddingTop + fixHeight;
		}

		if (target.classList.contains('layer')) {
			upperHeight = headerHeight + tabsHeight + contentPaddingTop + 54;
		}

		if (target.classList.contains('alert')) {
			upperHeight = headerHeight + contentPaddingTop + ((window.innerHeight - target.getBoundingClientRect().height) / 2);
		}

		Object.defineProperties(obj, {
			header: {
				get: function() {
					return header;
				}
			},
			tabs: {
				get: function() {
					return tabs;
				}
			},
			subs: {
				get: function() {
					return subs;
				}
			},
			content: {
				get: function() {
					return content;
				}
			},
			headerHeight: {
				get: function() {
					return headerHeight;
				}
			},
			tabsHeight: {
				get: function() {
					return tabsHeight;
				}
			},
			subsHeight: {
				get: function() {
					return subsHeight;
				}
			},
			contentPaddingTop: {
				get: function() {
					return contentPaddingTop;
				}
			},
			upperHeight: {
				get: function() {
					return upperHeight;
				}
			}
		});

		return obj;
	}

	function Buffer(selector) {
		if (document.querySelector(selector) == (null || undefined)) return;

		var target = document.querySelector(selector);
		var contents = target.querySelector('.contents');
		var fixer = [].filter.call(contents.children, function(x) { return x.classList.contains('fixer'); })[0];
		var isFixer = (fixer) ? true: false;
		var bufferSize = (typeof size == 'number') ? size : 0;
		var history = 0;
		var isEdited = false;
		var obj = {};
		var bufferEl = document.createElement('div');

		function init() {
			if (target.classList.contains('main')) return;
			if (isFixer) {bufferSize += fixer.offsetHeight;}

			bufferEl.classList.add('buffer');
			bufferEl.setAttribute('style', 'height: '+ bufferSize +'px !important'); + 'px';
			contents.insertAdjacentElement('beforeend', bufferEl);
		}

		function set(size) {
			history = bufferSize;
			bufferSize = size;
			isEdited = true;

			setSize(bufferSize);
		}

		function add(size) {
			history = bufferSize;
			bufferSize += size
			isEdited = true;

			setSize(bufferSize);
		}

		function revert() {
			bufferSize = history;

			setSize(bufferSize);
		}

		function setSize(size) {
			target.querySelector('.buffer').setAttribute('style', 'height: '+ size +'px !important');
		}

		function remove() {
			bufferEl.remove();
		};

		init();

		Object.defineProperties(obj, {
			isEdited: {
				get: function() {
					return isEdited;
				}
			},
			get: {
				get: function() {
					return bufferSize;
				}
			},
			set: { value: set },
			add: { value: add },
			revert: { value: revert },
			remove: { value: remove }
		});

		return obj;
	}

	function Stack() {
		var count = 1000;
		var stack = [];
		var obj = {};

		function set(dom) {
			if (dom) {
				stack.push(dom);
			}
		}

		function push(dom) {
			count++;

			if (dom) {
				stack.push(dom);
			}

			return count;
		}

		function pop(dom) {
			count--;

			if (dom) {
				stack.pop();
			}
		}

		Object.defineProperties(obj, {
			print: {
				get: function() {
					return stack;
				}
			},
			set: { value: set },
			push: { value: push },
			pop: { value: pop }
		});

		return obj;
	}

	function Scroll() {
		var body = document.body;
		var history = 0;

		return {
			save: function() {
				history = (window.hasScrollSave) ? getComputedStyle(body).marginTop.replace(/[^0-9]/g, '') : window.scrollY;

				if (!window.hasScrollSave) {
					body.classList.add('lock');
					body.style.marginTop = (history * -1) +'px';
				}

				window.hasScrollSave = true;
			},

			load: function() {
				if (stack.print.length <= 2) {
					window.hasScrollSave = false;

					body.classList.remove('lock');
					body.removeAttribute('style');
					window.scrollTo(0, history);
				}
			}
		}
	}

	function Dim() {
		var dim = document.createElement('div');

		dim.classList.add('dim');

		return {
			open: function(id, isPLA) {
				var zIndex = stack.push();

				dim.dataset.id = id.slice(1);

				if (isPLA) {
					document.querySelector(id).insertAdjacentElement('beforebegin', dim);
				} else {
					document.body.append(dim);
				}

				dim.style.zIndex = zIndex;

				setTimeout(function() {
					dim.classList.add('-active');
				});
			},

			close: function() {
				stack.pop();

				dim.classList.remove('-active');

				setTimeout(function() {
					dim.remove();
				}, 600);
			},

			show: function() {
				dim.classList.add('-active');
			},

			hide: function() {
				dim.classList.remove('-active');
			}
		}
	}

	function stackPLAA11y(id) {
		var page = document.querySelector('.page') || document.querySelector('.main');
		var PLA = document.querySelector(id);

		if (PLA) {
			PLA.tabIndex = 0;
			PLA.focus();
			PLA.removeAttribute('aria-hidden');
		}

		if (stack.print.length === 0) {
			stack.set(page);
		}

		if (page) {
			page.tabIndex = -1;
			page.ariaHidden = true;
		}

		stack.print.forEach(function(pla) {
			if (pla) {
				pla.tabIndex = -1;
				pla.ariaHidden = true;
			}
		});
	}

	function queuePLAA11y() {
		var PLA = stack.print;

		if (PLA.length > 2) {
			PLA[PLA.length - 1].removeAttribute('tabindex');
			PLA[PLA.length - 1].removeAttribute('aria-hidden');
			PLA[PLA.length - 2].tabIndex = 0;
			PLA[PLA.length - 2].removeAttribute('aria-hidden');
		}

		if (PLA.length <= 2) {
			PLA.forEach(function(pla) {
				if (pla) { pla.removeAttribute('aria-hidden'); }
			});

			PLA.forEach(function(pla) {
				if (pla) { pla.removeAttribute('tabindex'); }
			});
		}
	}

	function Popup(id) {
		var popup = document.querySelector(id);
		var isReinit = false;
		var information;
		var scroll = new Scroll();
		var popupBuffer;
		var isActive = false;
		var obj = {};

		function open(callback) {
			stackPLAA11y(id);

			var zIndex = stack.push(popup);

			scroll.save();
			popup.classList.add('-active');
			popup.style.zIndex = zIndex;

			information = new Information(id);
			popupBuffer = new Buffer(id);
			iframe(id);

			if (!isReinit) {
				initTextfield();
				mixForm();
				selectOption();
				a11y();
				isReinit = true;
			}

			if (callback instanceof Function) { callback(); }

			isActive = true;
		}

		function close(callback, isRemove) {
			queuePLAA11y(id);
			stack.pop(popup);
			scroll.load();

			popup.classList.remove('-active');
			popup.removeAttribute('style');
			popupBuffer.remove();

			if (isRemove) { popup.remove(); }
			if (callback instanceof Function) { callback(); }

			isActive = false;
		}

		Object.defineProperties(obj, {
			open: { value: open },
			close: { value: close },
			isOpen: {
				get: function() {
					return isActive;
				}
			},
			information: {
				get: function() {
					return information;
				}
			},
			buffer: {
				get: function() {
					return popupBuffer;
				}
			}
		});

		return obj;
	}

	function Layer(id) {
		var layer = document.querySelector(id);
		var isReinit = false;
		var information;
		var scroll = new Scroll();
		var dim = new Dim();
		var layerBuffer;
		var isActive = false;
		var obj = {};

		function open(callback) {
			scroll.save();

			new Promise(function(resolve, reject) {
				setTimeout(resolve);
			}).then(setTimeout(function(){
				dim.open(id, true);
			})).then(setTimeout(function(){
				stackPLAA11y(id);
				layer.classList.add('-active');
				layer.style.zIndex = stack.push(layer);

				information = new Information(id);
				layerBuffer = new Buffer(id);
				iframe(id);

				if (!isReinit) {
					initTextfield();
					mixForm();
					selectOption();
					a11y();

					isReinit = true;
				}

				if (callback instanceof Function) { callback(); }

				isActive = true;
			}));
		};

		function close(callback, isRemove) {
			scroll.load();
			
			new Promise(function(resolve, reject) {
				setTimeout(resolve);
			}).then(setTimeout(function(){
				layer.classList.remove('-active');
				layer.removeAttribute('style');

				if (isRemove) {
					setTimeout(function() {
						layer.remove();
					}, 400);
				}
				if (callback instanceof Function) { callback(); }
				selectOption();
				queuePLAA11y(id);
				stack.pop(layer);
			})).then(setTimeout(function(){
				layerBuffer.remove();
			}, 400)).then(setTimeout(function(){
				dim.close();

				isActive = false;
			}));
		};

		Object.defineProperties(obj, {
			open: { value: open },
			close: { value: close },
			isOpen: {
				get: function() {
					return isActive;
				}
			},
			information: {
				get: function() {
					return information;
				}
			},
			buffer: {
				get: function() {
					return layerBuffer;
				}
			}
		});

		return obj;
	}

	function Alert(id) {
		var alert = document.querySelector(id);
		var isReinit = false;
		var information;
		var scroll = new Scroll();
		var dim = new Dim();
		var alertBuffer;
		var isActive = false;
		var obj = {};

		function open(callback) {
			scroll.save();
			iframe(id);

			new Promise(function(resolve, reject) {
				setTimeout(resolve);
			}).then(setTimeout(function(){
				dim.open(id, true);
			})).then(setTimeout(function(){
				stackPLAA11y(id);
				alert.classList.add('-active')
				alert.style.zIndex = stack.push(alert);

				information = new Information(id);
				alertBuffer = new Buffer(id);

				if (!isReinit) {
					initTextfield();
					a11y();

					isReinit = true;
				}

				if (callback instanceof Function) { callback(); }

				isActive = true;
			}));
		}

		function close(callback, isRemove) {
			scroll.load();

			new Promise(function(resolve, reject) {
				setTimeout(resolve);
			}).then(setTimeout(function(){
				alert.classList.remove('-active');
				alert.removeAttribute('style');

				if (isRemove) {
					setTimeout(function() {
						alert.remove();
					}, 400);
				}
				if (callback instanceof Function) { callback(); }

				queuePLAA11y(id);
				stack.pop(alert);
			})).then(setTimeout(function(){
				alertBuffer.remove();
			}, 400)).then(setTimeout(function(){
				dim.close();

				isActive = false;
			}));
		};

		Object.defineProperties(obj, {
			open: { value: open },
			close: { value: close },
			isOpen: {
				get: function() {
					return isActive;
				}
			},
			information: {
				get: function() {
					return information;
				}
			},
			buffer: {
				get: function() {
					return alertBuffer;
				}
			}
		});

		return obj;
	}

	// 240327 mixform function for reinit
	function mixForm() {
		// 240221 info div tag to p && onlytext class add
		var mixForm = document.querySelectorAll('.mix');
		mixForm.forEach(function(e){
			var divLength = e.getElementsByTagName('div');

			if(divLength.length-1 === 0 && e.lastElementChild.classList.contains('text')) {e.lastElementChild.classList.add('-onlyChild');}

			var infoBox = e.querySelectorAll('.info');
			infoBox.forEach(function(ele) {
				var pBox = document.createElement('p');
				pBox.classList = ele.classList;
				(ele.id) ? pBox.id = ele.id : null;
				pBox.innerHTML = ele.innerHTML;
				ele.parentNode.replaceChild(pBox, ele);
			})   


			var labelinBox = e.querySelectorAll('.label');
			labelinBox.forEach(function(old) {
				if(old.parentNode.classList.contains('text')) {old.parentNode.classList.add('floatLabel');} 
			})

			var mixMoneyText = e.querySelectorAll('.money');
			mixMoneyText.forEach(function(ele) {
				ele.classList.remove('-lined');
				ele.classList.add('currency');

				var mixMoneySibling = ele.previousElementSibling;
				if(divLength.length-1 === 1) {mixMoneySibling.classList.add('-onlytext');}
				if(ele.parentNode.classList.contains('mix')) {ele.parentNode.classList.add('exchange');} 
			});

			// 240313 calendar class add
			e.querySelectorAll('.tilde, .dash, .dot').forEach(function(ele) {
				var firstInput = ele.previousElementSibling.querySelector('input');
				var lastInput = ele.nextElementSibling.querySelector('input');
				var mixWrap = ele.closest('.mix');

				if(ele.classList.contains('tilde')) {
					firstInput.classList.add('-calendar', 'start-date');
					lastInput.classList.add('-calendar', 'end-date');
				} else if (ele.classList.contains('dash')) {
					firstInput.classList.add('rnn-first');
					lastInput.classList.add('rnn-last');
					if(lastInput.parentNode.nextElementSibling !== null) {lastInput.classList.add('bridge');}
				} else if(ele.classList.contains('dot')) {
					if(ele.previousElementSibling.classList.contains('-unit') && !mixWrap.classList.contains('exchange')) {mixWrap.classList.add('exchange');}
					if(firstInput&&lastInput) {
						firstInput.readOnly && lastInput.readOnly ? mixWrap.classList.add('allReadOnly') : false;
					}
				}
			});
			
			// 240409 더치페이 data display 
			var pSpace = e.querySelector('p.space');
			if(pSpace) {
				var spaceLabel = document.createElement('div');
				spaceLabel.classList.add('label', 'space');
				spaceLabel.innerText = pSpace.innerText;
				pSpace.parentNode.classList.add('dataDisplay')
				pSpace.parentNode.replaceChild(spaceLabel, pSpace);
			}

			var mixSpace = e.querySelectorAll('.space');
			mixSpace.forEach(function(ele) {
				var iconButton = ele.querySelector('.icon-button');
				if(iconButton !== null) {
					var ButtonField = iconButton.closest('.field');
					if(iconButton.classList.contains('-search')) {
						ButtonField.classList.add('search-field')

					} else if(iconButton.classList.contains('-calendar')) {
						ButtonField.classList.add('datepick-field')
					}
				}
			})
		});
	}

	function switchLabelGroup() {
		const switches = document.querySelectorAll('.switch');
		switches.forEach(function(e){
			var switchField = e.closest('.field');
			var switchParent = e.parentNode;
			var switchInput = e.firstElementChild;
			if(switchField && switchParent.classList.contains('label-group')) {
				switchField.classList.add('switch-label');
				function checkedEvent() {
					if(switchInput.checked) {
						switchField.classList.add('-active');
					} else {
						switchField.classList.remove('-active');
					} 
				}
				checkedEvent();
				function dataPane() {
					var dataPane = switchField.querySelectorAll('[data-switch]');
					dataPane.forEach(function(ele){
						if(ele.getAttribute('data-switch') === "off") {
							ele.setAttribute('data-switch', 'on');
							ele.setAttribute('data-role', 'visible');
							
						} else {
							ele.setAttribute('data-switch', 'off');
							ele.setAttribute('data-role', 'hidden');
						}
					})
				}
				switchInput.addEventListener('change', checkedEvent);
				switchInput.addEventListener('change', dataPane);
			} 
		});
	}

	/* 24.03.04 agreement case add */
	function agreeComp() {
		var agreementItem = document.querySelectorAll('.agree');
		agreementItem.forEach(function(e) {
			if(e.firstElementChild === e.lastElementChild) {e.classList.add('only-child');} 
		})
	}

	function accSelector() {
		var accountDisplay = document.querySelectorAll('.account');
		accountDisplay.forEach(function(e) {
			if(e.firstElementChild === e.lastElementChild) {e.classList.add('account-selector');}
		})
	}

	// 24.03.27 create segment Control function
	function segmentControls() {
		var segControl = document.querySelectorAll('.box-radios');
		segControl.forEach(function(seg){
			var segSibling = seg.nextElementSibling;
			if(segSibling) {
				if(segSibling.className === 'segments-panels' || segSibling.className === 'mix exchange') {
					var segOpt = seg.querySelectorAll('.box-radio');
					segOpt.forEach(function(segOpt){
						var segTar = segOpt.querySelector('input');
						segTar.addEventListener('click', mixForm);
					})
				}
			}
		})
	}
	return {
		init: init,
		throttle: throttle,

		Buffer: Buffer,
		Stack: Stack,
		Scroll: Scroll,
		Dim: Dim,
		Popup: Popup,
		Layer: Layer,
		Alert: Alert
	};
}());

UI.init();

var Popup = PLA(UI.Popup);
var Layer = PLA(UI.Layer);
var Alert = PLA(UI.Alert);

function PLA(type) {
	return {
		open: function(id, callback) {
			window[id] = new type('#'+ id);

			window[id].open(callback);
		},

		close: function(id, callback, isRemove) {
			window[id].close(callback, isRemove);
		},
	}
}
/* 임시소스 - 추후 삭제 예정 */
document.addEventListener('keypress', function(event) {
	if (event.keyCode === 10) {
		document.body.classList.toggle('dark-mode');
	}
});
/* 기타공통 - 시간선택 */
var selld1 = $('.datepicker-widget').find('.year').find('.on').index();
var selld2 = $('.datepicker-widget').find('.month').find('.on').index();
var selld3 = $('.datepicker-widget').find('.day').find('.on').index();
var selld4 = $('.datepicker-widget').find('.time').find('.on').index();
var selld5 = $('.datepicker-widget').find('.minute').find('.on').index();
$('.datepicker-widget').find('.year').animate({scrollTop:(selld1-1)*40},'500');
$('.datepicker-widget').find('.month').animate({scrollTop:(selld2-1)*40},'500');
$('.datepicker-widget').find('.day').animate({scrollTop:(selld3-1)*40},'500');
$('.datepicker-widget').find('.time').animate({scrollTop:(selld4-1)*50},'500');
$('.datepicker-widget').find('.minute').animate({scrollTop:(selld5-1)*50},'500');
var scrollEndEvntTimerId;
function visibleEvnt(){
	var el = this;
	var items = $(el).find('li').not(':first-child, :last-child');
	var idx = Math.round($(el).scrollTop() / 50);
	items.eq(idx).addClass('on').siblings().removeClass('on');

	//scroll end event capture
	clearTimeout(scrollEndEvntTimerId);
	scrollEndEvntTimerId = setTimeout(function(){
		$('.datepicker-widget > ul').off('scroll',visibleEvnt);
		$(el).stop().animate({scrollTop:idx *50},{
			duration:40,
			step:function(now, fx){
				if (fx.pos == 1){
					$(this).scrollTop((idx *40) - 3);
					setTimeout(function(){
						$('.datepicker-widget > ul').on('scroll',visibleEvnt);
					},100)
				}
			}
		});
	},100);
};

setTimeout(function(){
	$('.datepicker-widget > ul').on('scroll',visibleEvnt)
},500);

/* 이체주기 선택 */

$('.datepicker-widget.cycle-type').find('ul').find('li').click(function(){
	$(this).addClass('on');
	$(this).siblings().removeClass('on');
	var selldIdx = $(this).index();
	if ($(this).parent().hasClass('cycle')) {
		var onSelecter = $('.cycle-list').find('ul').eq(selldIdx).find('.on').index();
		$('.cycle-list').find('ul').eq(selldIdx).show().siblings().hide();
		$('.cycle-list').find('ul').eq(selldIdx).animate({scrollTop:(onSelecter)*60},'500');
	}
});

/* Custom Tab UI */
function customUsTab(usTab, usPanel, usOn){
	$('.'+usTab).find('button').on('click', function(){
		$('.'+usTab).find('li').removeClass(usOn).find('.hide').remove();
		$(this).closest('li').addClass(usOn).find('button').append(' <span class="hide">선택됨</span>');
		$('.'+usPanel).removeClass(usOn).attr('tabindex', '-1');
		$('.'+usPanel + '[id=' + $(this).attr('aria-controls') + ']').addClass(usOn).attr('tabindex', 0);
	})
}

// 240906 hashtag 공통 추가
var hashTags = document.querySelectorAll('.hashtags > .hash');
for(const tag of hashTags) {
	var hash = '#';
	tag.prepend(hash)
}
// 240925 common icons add aria-hidden
var icos = document.querySelectorAll('i.icos');
for(const icon of icos) {
	icon.setAttribute('aria-hidden', 'true');
}

// 241011 Bubbling propagation 추가
const cardBoxes = document.querySelectorAll('.card-box');
for(const cardBox of cardBoxes) {
	function bubblingProps() {
		var clickTargets = cardBox.querySelectorAll('button', 'a');
		for(const clickTarget of clickTargets) {
			clickTarget.addEventListener('click', function(e) {
				e.stopPropagation();
			})
		}
		var valueTargets = cardBox.querySelectorAll('.value');
		for(const valueTarget of valueTargets) {
			if(valueTarget.hasChildNodes('.noBacDiv', '.showBalance')) {
				valueTarget.addEventListener('click', function(ele) {
					ele.stopPropagation();
				});
			}
		}
	}
	bubblingProps();
	var config = {attributes: true, childList: true, subtree: true}
	var bubblingObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			bubblingProps();
			bubblingObserver.disconnect();
		})
	})
	bubblingObserver.observe(cardBox, config);
	if(cardBox.onclick !== null) {
		cardBox.setAttribute('tabindex', 0);
	}
}

// 241101 dragdrop sorting 공통 수정
function dragDropSort() {
	var sortListWraps = document.querySelectorAll('.sortableui-wrap');
	for(const sortWrap of sortListWraps) {
		var sortList = sortWrap.querySelector('.sort-list');
		var sortItems = sortList.querySelectorAll('li:not(.ui-state-disabled)');
		var moveBtns = $(sortWrap).find('.sort-button-box').children('button');
		function getFirstLast() {
			var liItm = $(sortList).children(':not(.ui-state-disabled)');
			liItm.removeClass('first last').first().addClass('first').end().last().addClass('last');
			liItm.find('.sort-button-box').children('button').attr('disabled', false);
			liItm.first().find('.sort-button-up').attr('disabled', true);
			liItm.last().find('.sort-button-down').attr('disabled', true);
		}
		$(sortList).sortable({
			handle: '.sort-button',
			axis : 'y',
			containment: sortList, 		
			items: sortItems,
			create: function(event, ui) {
				getFirstLast(ui);
			},
			update: function(event, ui) {
				getFirstLast(ui);
			},
		});
		$(moveBtns).on('click', function(e) {
			var targetBtn = e.target;
			var targetLi = targetBtn.closest('li');
			$(targetBtn).hasClass('sort-button-up') ? $(targetLi).prev().before(targetLi) : $(targetBtn).hasClass('sort-button-down') ? $(targetLi).next().after(targetLi) : undefined;
			getFirstLast();
		})
	}
}
dragDropSort();
