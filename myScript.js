window.addEventListener("load", function () {
    // 이미지 배열 정의
    const images = [
        "img/chat1.png",
        "img/chat2.png",
        "img/chat3.png",
        "img/chat4.png",
        "img/chat5.png"
    ];

    const images2 = [
        "img/b1.png",
        "img/b2.png",
        "img/b3.png",
        "img/b4.png",
        "img/b5.png"
    ];

    const images3 = [
        "img/case1.png",
        "img/case2.png",
        "img/case3.png",
        "img/case4.png"
    ];

    const blurImages = [
        "img/blur.png",
        "img/blur.png"
    ];

    // .main-container 요소 선택
    const container = document.querySelector('.container');

    // 이미지 요소들 선택
    let chatImages = document.querySelectorAll(".chat");
    let boxes = document.querySelectorAll(".box");
    let cases = document.querySelectorAll(".case");
    let blurElements = [];

    // 이미지 설정
    chatImages.forEach((chatImage, index) => {
        chatImage.style.backgroundImage = `url(${images[index]})`;
    });

    boxes.forEach((box, index) => {
        box.style.backgroundImage = `url(${images2[index]})`;
    });

    cases.forEach((caseElement, index) => {
        const img = document.createElement('img');
        img.src = images3[index];
        img.classList.add('custom-img');
        caseElement.appendChild(img);

        img.addEventListener('click', () => showOverlay(img));
    });

    // 블러 요소 생성
    blurImages.forEach((blurImage) => {
        const blurElement = document.createElement('div');
        blurElement.classList.add('blur');
        blurElement.style.backgroundImage = `url(${blurImage})`;
        container.appendChild(blurElement);
        blurElements.push(blurElement);
    });

    // 현재 인덱스 및 총 이미지 수 정의
    let currentIndex = 0;
    let totalChatImages = chatImages.length;
    let totalBoxImages = boxes.length;
    let totalCaseImages = cases.length;
    let totalBlurImages = blurElements.length;
    let totalImages = totalChatImages + totalBoxImages + totalCaseImages + totalBlurImages;

    const gifContainer = document.querySelector('.gif-container');
    
    let currentTextIndex = 0;
    const animatedTexts = document.querySelectorAll('.animated-text');
    let isCounting = false;

    const counter = (counterElement, max) => {
        let now = 0;
        isCounting = true; // 카운트 진행 중임을 표시

        const handle = setInterval(() => {
            now += Math.ceil(max / 100); // 숫자 증가 속도 조정
            if (now >= max) {
                now = max;
                clearInterval(handle);
                isCounting = false; // 카운트가 완료되면 스크롤 활성화
            }
            counterElement.textContent = now.toLocaleString(); // 숫자 포맷팅
        }, 30);
    };

    function lockScroll() {
        document.body.style.overflow = 'hidden';
    }

    function unlockScroll() {
        document.body.style.overflow = '';
    }

    // 스크롤 이벤트 핸들러
    function handleScroll(event) {
        const scrollThreshold = 100; // 스크롤 민감도 조절을 위한 임계값
        if (Math.abs(event.deltaY) < scrollThreshold) {
            return; // 작은 움직임 무시
        }

        if (isCounting) {
            lockScroll(); // 스크롤 잠금
            return;
        } else {
            unlockScroll(); // 스크롤 잠금 해제
        }

        hideOverlay();

        // 블러 값 계산
        let blurAmount;
        if (currentTextIndex > 0 && !(currentTextIndex === 1 && event.deltaY < 0)) {
            blurAmount = 12; // 텍스트가 로드된 상태에서는 블러 값을 고정
        } else {
            blurAmount = Math.min((currentIndex - (totalChatImages + totalBoxImages + totalCaseImages)) * 12);
            blurAmount = Math.max(0, blurAmount); // 최소값은 0으로 유지
        }
        container.style.filter = `blur(${blurAmount}px)`;
        container.style.setProperty('--overlay-opacity', blurAmount / 12);

        if (blurAmount >= 4) {
            cases.forEach(caseElement => caseElement.classList.add('disabled'));
        } else {
            cases.forEach(caseElement => caseElement.classList.remove('disabled'));
        }

        if (blurAmount >= 12 && currentTextIndex === 0 && !isCounting) {
            const firstTextElement = document.querySelector('.animated-text.first');
            if (firstTextElement) {
                counter(firstTextElement, 51578500000); // 카운트 시작
            } else {
                console.error("첫 번째 .animated-text 요소를 찾을 수 없습니다.");
            }
        }

        if (blurAmount === 0 || currentTextIndex === 0) {
            if (event.deltaY > 0) {
                if (currentIndex < totalImages - 1) {
                    if (currentIndex < totalChatImages) {
                        chatImages[currentIndex].classList.add("show");
                    } else if (currentIndex < totalChatImages + totalBoxImages) {
                        let boxIndex = currentIndex - totalChatImages;
                        boxes[boxIndex].classList.add("show");
                    } else if (currentIndex < totalChatImages + totalBoxImages + totalCaseImages) {
                        let caseIndex = currentIndex - totalChatImages - totalBoxImages;
                        cases[caseIndex].classList.add("show");
                    } else {
                        let blurIndex = currentIndex - totalChatImages - totalBoxImages - totalCaseImages;
                        blurElements[blurIndex].classList.add("show");
                    }
                    currentIndex++;
                }
            } else if (event.deltaY < 0) {
                if (currentIndex > 0) {
                    currentIndex--;

                    if (currentIndex < totalChatImages) {
                        chatImages[currentIndex].classList.remove("show");
                    } else if (currentIndex < totalChatImages + totalBoxImages) {
                        let boxIndex = currentIndex - totalChatImages;
                        boxes[boxIndex].classList.remove("show");
                    } else if (currentIndex < totalChatImages + totalBoxImages + totalCaseImages) {
                        let caseIndex = currentIndex - totalChatImages - totalBoxImages;
                        cases[caseIndex].classList.remove("show");
                    } else {
                        let blurIndex = currentIndex - totalChatImages - totalBoxImages - totalCaseImages;
                        blurElements[blurIndex].classList.remove("show");
                    }
                }
            }
        }

        if (blurAmount >= 12) {
            if (event.deltaY > 0) {
                if (currentTextIndex < animatedTexts.length) {
                    animatedTexts[currentTextIndex].classList.add("show");
                    if (currentTextIndex > 0 && currentTextIndex - 1 < animatedTexts.length) {
                        animatedTexts[currentTextIndex - 1].classList.remove("show");
                    }
                    currentTextIndex++;
                } else if (currentTextIndex === animatedTexts.length) {
                    const footerText = document.querySelector('.animated-text.footer');
                    if (footerText) {
                        footerText.classList.add("show");
                        currentTextIndex++;
                    }
                }
            } else if (event.deltaY < 0) {
                if (currentTextIndex > 1) {
                    currentTextIndex--;
                    if (animatedTexts[currentTextIndex] !== undefined) {
                        animatedTexts[currentTextIndex].classList.remove("show");
                        if (currentTextIndex > 0 && currentTextIndex - 1 < animatedTexts.length) {
                            animatedTexts[currentTextIndex - 1].classList.add("show");
                        }
                    }
                } else if (currentTextIndex === 1) {
                    animatedTexts[0].classList.remove("show");
                    currentTextIndex = 0;
                }

                if (currentTextIndex === animatedTexts.length - 1) {
                    const footerText = document.querySelector('.animated-text.footer');
                    if (footerText) {
                        footerText.classList.remove("show");
                    }
                }
            }
        }

        const title = document.querySelector('.title');
        const newOpacity = Math.max(0, 1 - (currentIndex / totalImages * 50)); // opacity 계산
        title.style.opacity = newOpacity;

        const newGifOpacity = Math.max(0, 1 - (currentIndex / totalImages * 50));
        gifContainer.style.opacity = newGifOpacity;
    }

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("wheel", handleScroll);


    // 페이지 위로 스크롤하는 함수
    function scrollToTop() {
        // 애니메이션 단계적으로 제거
        const allElements = [...chatImages, ...boxes, ...cases, ...blurElements].reverse();
        let elementIndex = currentIndex - 1;
    
        const removeAnimationInterval = setInterval(() => {
            if (elementIndex >= 0) {
                if (elementIndex < totalChatImages) {
                    chatImages[elementIndex].classList.remove("show");
                } else if (elementIndex < totalChatImages + totalBoxImages) {
                    let boxIndex = elementIndex - totalChatImages;
                    boxes[boxIndex].classList.remove("show");
                } else if (elementIndex < totalChatImages + totalBoxImages + totalCaseImages) {
                    let caseIndex = elementIndex - totalChatImages - totalBoxImages;
                    cases[caseIndex].classList.remove("show");
                } else {
                    let blurIndex = elementIndex - totalChatImages - totalBoxImages - totalCaseImages;
                    blurElements[blurIndex].classList.remove("show");
                }
                elementIndex--;
            } else {
                clearInterval(removeAnimationInterval);
    
                // 타이틀과 GIF의 순차적 나타남
                setTimeout(() => {
                    const title = document.querySelector('.title');
                    const gifContainer = document.querySelector('.gif-container');
    
                    // 애니메이션으로 서서히 보이게 함
                    title.style.transition = 'opacity 1.5s ease-in-out';
                    gifContainer.style.transition = 'opacity 1.5s ease-in-out';
                    title.style.opacity = 1;
                    gifContainer.style.opacity = 1;
                }, 400); // 요소 사라진 후 약간의 딜레이 후 실행
            }
        }, 100); // 요소가 사라지는 시간 간격 조정 가능
    
        // 텍스트 애니메이션 사라지기
        let textIndex = currentTextIndex - 1;
        const footerText = document.querySelector('.animated-text.footer'); // 푸터 요소 선택
    
        const removeTextInterval = setInterval(() => {
            if (textIndex >= 0 && animatedTexts[textIndex]) {
                animatedTexts[textIndex].classList.remove('show');
                textIndex--;
            } else {
                clearInterval(removeTextInterval);
                currentTextIndex = 0;
    
                // 푸터 제거
                if (footerText) {
                    footerText.classList.remove('show');
                }
            }
        }, 150); // 시간 간격 조정 가능
    
        // 모든 인덱스 초기화
        currentIndex = 0;
    
        // 블러 필터 제거
        container.style.filter = `blur(0)`;
        container.style.setProperty('--overlay-opacity', 0);
    
        // 스크롤 최상단 이동
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
    
    

    document.querySelector(".pageupimage").addEventListener("click", scrollToTop);


    let overlay, closeButton;

    function hideOverlay() {
        if (overlay) overlay.style.display = 'none';
    }

    function showOverlay(img) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'overlay';

            closeButton = document.createElement('img');
            closeButton.src = 'img/close.png';
            closeButton.className = 'close-btn';
            overlay.appendChild(closeButton);

            const overlayTitleText = document.createElement('div');
            overlayTitleText.className = 'overlay-title-text';
            overlay.appendChild(overlayTitleText);

            const overlaySubtitleText = document.createElement('div');
            overlaySubtitleText.className = 'overlay-subtitle-text';
            overlay.appendChild(overlaySubtitleText);

            const overlayText = document.createElement('div');
            overlayText.className = 'overlay-text';
            overlay.appendChild(overlayText);

            linkImage = document.createElement('img');
            linkImage.src = 'img/link.png';
            linkImage.className = 'link-btn';
            overlay.appendChild(linkImage);

            const overlaySource = document.createElement('div');
            overlaySource.className = 'overlay-source';
            overlay.appendChild(overlaySource);

            document.body.appendChild(overlay);
            closeButton.addEventListener('click', hideOverlay);
        }

        linkImage.removeEventListener('click', linkImageClickHandler);
        linkImageClickHandler = () => {
            const links = {
                'case1.png': 'http://www.labortoday.co.kr/news/articleView.html?idxno=221429',
                'case2.png': 'https://www.joongang.co.kr/article/23923819',
                'case3.png': 'https://youtu.be/Iw3eY8p39HM?si=c79sj1F_uG6qku0L',
                'case4.png': 'https://worknworld.kctu.org/news/articleView.html?idxno=504927'
            };
            const imageName = img.src.split('/').pop();
            const linkUrl = links[imageName] || 'https://default-link.com';
            window.open(linkUrl, '_blank');
        };
        linkImage.addEventListener('click', linkImageClickHandler);

        const sources = {
            'case1.png': '정소희, "[“주 70시간 노동”] 50대 울산 롯데택배 노동자 과로사 추정", 매일노동뉴스, 2024. 05. 08. http://www.labortoday.co.kr/news/articleView.html?idxno=221429',
            'case2.png': '한영혜, "택배기사에 ‘엘리베이터 사용금지’ 요구한 아파트", 중앙일보, 2020. 11. 18. https://www.joongang.co.kr/article/23923819',
            'case3.png': '“[자막뉴스] "와 죽겠다"더니 다음날 사망 로켓 설치가 뭐길래 (MBC뉴스)” 유튜브 비디오, 2:18, 게시자”MBCNEWS” 2024. 9. 8. https://youtu.be/Iw3eY8p39HM?si=c79sj1F_uG6qku0L',
            'case4.png': '서비스연맹, "로켓배송이 부른 타살... 쿠팡 택배기사 또 과로사", 노동과 세계, 2024. 06. 28. https://worknworld.kctu.org/news/articleView.html?idxno=504927'
        };

        const imageName = img.src.split('/').pop();
        overlay.querySelector('.overlay-source').textContent = sources[imageName] || '출처 없음';


        if (img.src.includes('case1.png')) {
            overlay.querySelector('.overlay-title-text').textContent = '용차비, 일당 때문에 과로 내몰려';
            overlay.querySelector('.overlay-subtitle-text').textContent = '울산의 50대 택배노동자가 주 70시간 가까운 노동에 시달리다 숨지는 일이 발생했다.';
            overlay.querySelector('.overlay-text').innerHTML = '이씨와 함께 일한 동료 A씨는 “2월에도 과로가 의심된다며 정밀검사와 휴식을 요구받았지만 쓰러진 당일에도 일터로 <br> 복귀해 일을 끝마친 것으로 알고 있다”며 “용차 비용 때문에 택배노동자는 쉬고 싶어도 쉴 수가 없다”고 호소했다. <br> 특수고용직인 택배노동자는 병가 등으로 일을 쉬려면 대체근무자를 사용하는 ‘용차 비용’을 지불해야 한다. <br><br> 용차 비용은 일당의 1.5~2배로 부담이 상당하다. 이 때문에 병가를 마다하고 과로에 내몰리는 경우가 부지기수다.';
        } else if (img.src.includes('case2.png')) {
            overlay.querySelector('.overlay-title-text').textContent = '택배기사에 [엘리베이터 사용 금지] 요구한 아파트';
            overlay.querySelector('.overlay-subtitle-text').innerHTML = '전남 영광군의 한 아파트에서 택배기사 A씨 부부가 물건을 배송하는 과정에서 <br>  엘리베이터를 장시간 잡아둔다는 이유로 입주민들이 승강기 사용을 금지한 일이 발생했다.';
            overlay.querySelector('.overlay-text').innerHTML = '이에 A씨 부부는 일부 입주민들의 결정에 억울함을 호소하는 입장문을 승강기 안에 게시했다. <br> 이들은 “몇몇 입주민분들은 강력한 항의와 욕설을 하시며 불만을 표출하셨고 경찰까지 출동하는 상황이 발생했다”며 <br>“그래서 앞으로 택배 물건은 경비실에 보관하도록 하겠다”고 부연했다.';
        } else if (img.src.includes('case3.png')) {
            overlay.querySelector('.overlay-title-text').textContent = '로켓설치, “와 죽겠다”더니 다음 날 사망';
            overlay.querySelector('.overlay-subtitle-text').textContent = '충북 청주의 쿠팡 가전 가구 배송 대리점, 대표 정 모 씨는 건물 뒤편에서 숨진 채 발견됐다.';
            overlay.querySelector('.overlay-text').innerHTML = '여름철로 접어들며 에어컨 주문이 크게 늘어난 시기였다고 유가족과 직원은 말했다. <br> "와 죽을 것 같다, 죽을 것 같아. 고비다 고비. 한 일주일째 잠을 못 자고 있다."  <br> 정 대표는 쿠팡에서 가구와 가전제품을 주문하면 배송해서 설치까지 해주는 로켓설치 대리점을 운영했다.  <br> 이곳은 밤 12시 전에 주문하면 이튿날 배송하는 게 계약 조건이다. ';
        } else if (img.src.includes('case4.png')) {
            overlay.querySelector('.overlay-title-text').textContent = '로켓 배송이 부른 타살, 택배기사 또 과로사';
            overlay.querySelector('.overlay-subtitle-text').textContent = '쿠팡 택배노동자가 또 숨졌다. 쿠팡이 자랑하는 ‘로켓배송’을 하느라 주 60시간 이상 심야 배송을 하던 노동자였다.';
            overlay.querySelector('.overlay-text').innerHTML = '목숨을 잃은 故정슬기 씨(41세)은 쿠팡CLS 남양주2캠프 굿로지스대리점에서 일하던 택배노동자였다.  <br> 노조에 따르면 고인은 보통 저녁 8시 30분부터 다음날 새벽 6시 30분~7시까지 업무를 해 왔다고 한다. <br> 출퇴근거리를 제외하고도 하루 이동거리가 100km에 달했다. 배송을 제시간 안에 해내기 위해 고인이 자신의 사비까지 들여 배송지원 아르바이트를 고용할 정도였다.  <br> 사망 전날인 5월 27일 밤부터 28일 새벽까지도 심야 과로는 계속됐다. <br><br> 강민욱 택배노조 부위원장은 “실제 고인은 가족에게 수차례 ‘아침 7시까지 배송하지 못하면 일자리를 잃을 수 있다’고 호소했다”며,  <br> 이런 쿠팡의 노동착취 구조가 고인의 목숨을 빼앗았다고 비판했다.';
        } else {
            overlay.querySelector('.overlay-title-text').textContent = '사례 없음';
            overlay.querySelector('.overlay-subtitle-text').textContent = '상품 설명이 없습니다.';
            overlay.querySelector('.overlay-text').innerHTML = '';
        }

        overlay.style.display = 'flex';
    }

    let linkImageClickHandler;
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("wheel", hideOverlay, { passive: false });
});
