document.addEventListener("DOMContentLoaded", () => {
    const task1Btn = document.getElementById('btn1');
    task1Btn.addEventListener('click', () => {
        const x = document.getElementById('header');
        const y = document.getElementById('footer');
        const temp = x.innerHTML;
        x.innerHTML = y.innerHTML;
        y.innerHTML = temp;
    })

    const task2Btn = document.getElementById('btn2');
    task2Btn.addEventListener('click', () => {
        const block3 = document.querySelector('.block3');

        const a = 10;
        const b = 20;
        const h = 5;
        function calculateTrapezoidArea(base1, base2, height) {
            return ((base1 + base2)/ 2) * height;
        }

        const area = calculateTrapezoidArea(a, b, h);
        const resultParagraph = document.createElement('p');
        resultParagraph.style.color = '#08c5de';
        resultParagraph.style.fontWeight = 'bold';
        resultParagraph.innerHTML = `Area result (a=${a}, b=${b}, h=${h}): ${area}`;
        block3.appendChild(resultParagraph);
    })

    checkCookiesAndRender();

    function checkCookiesAndRender() {
        const savedNum = getCookie('reversedNumber');
        const block3 = document.querySelector('.block3');

        if (savedNum) {
            const userResponse = confirm(`Збережене значення в cookies: ${savedNum}. \nНатисніть "ОК", щоб зберегти дані, або "Скасувати", щоб видалити.`);
            if(userResponse) {
                alert('Cookies наявні. Необхідно перезавантажити сторінку (це повідомлення згідно завдання).');
            } else {
                deleteCookie('reversedNumber');
                location.reload();
            }
        } else {
            renderNumberForm(block3);
        }
    }

    function renderNumberForm(container) {
        const formContainer = document.createElement('div');
        formContainer.innerHTML = `
            <hr>
            <h4>Task3 reverse number</h4>
            <input type="number" id="numInput" placeholder="Введіть натуральне число">
            <button id="processNumBtn">Перевернути</button>
        `;
        container.appendChild(formContainer);
        document.getElementById('processNumBtn').addEventListener('click', () => {
            const input = document.getElementById('numInput').value;
            if(input && input > 0) {
                const reversed = input.split('').reverse().join('');

                alert('Перевернуте число:' + reversed);

                setCookie('reversedNumber', reversed, 7);
                location.reload();
            } else {
                alert('Введіть коректне натуральне число.');
            }
        })
    }

    const savedAlignment = localStorage.getItem('blockAlignment');
    if (savedAlignment) {
        applyAlignment(savedAlignment);
    }

    const task4Btn = document.getElementById('btn4');
    task4Btn.addEventListener('click', () => {
        if (document.getElementById('alignPanel')) return;

        const controlPanel = document.createElement('div');
        controlPanel.id = 'alignPanel';
        controlPanel.style.position = 'fixed';
        controlPanel.style.top = '50%';
        controlPanel.style.left = '50%';
        controlPanel.style.transform = 'translate(-50%, -50%)';
        controlPanel.style.background = '#333';
        controlPanel.style.padding = '20px';
        controlPanel.style.border = '2px solid #08c5de';
        controlPanel.style.zIndex = '1000';
        controlPanel.style.color = '#fff';

        controlPanel.innerHTML = `
        <h4 style="margin-top:0">Вирівнювання блоків 2, 3, 4</h4>
        <label><input type="radio" name="align" value="left"> Зліва</label><br>
        <label><input type="radio" name="align" value="center"> По центру</label><br>
        <label><input type="radio" name="align" value="right"> Справа</label><br><br>
        <button id="closePanel">Закрити</button>
    `;

        document.body.appendChild(controlPanel);

        const currentSaved = localStorage.getItem('blockAlignment');
        if (currentSaved) {
            const radioToSelect = controlPanel.querySelector(`input[value="${currentSaved}"]`);
            if (radioToSelect) radioToSelect.checked = true;
        }

        const radios = controlPanel.querySelectorAll('input[name="align"]');

        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const newValue = e.target.value;

                applyAlignment(newValue);

                localStorage.setItem('blockAlignment', newValue);
                console.log('Збережено в localStorage:', newValue);
            });
        });

        document.getElementById('closePanel').addEventListener('click', () => {
            controlPanel.remove();
        });
    });

    function applyAlignment(alignValue) {
        const blocks = document.querySelectorAll('.block2, .block3, .block4');

        blocks.forEach(block => {
            block.style.textAlign = alignValue;

            const children = block.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, li, a, table, th, td, tr');

            children.forEach(child => {
                child.style.textAlign = alignValue;
            });
        });
    }

    const links = document.querySelectorAll('.block2 a');
    const blocks = ['.block1', '.block2', '.block3', '.block4', '.block5', '.block6'];

    // 1. ІНІЦІАЛІЗАЦІЯ: При завантаженні перевіряємо всі блоки
    // Якщо в сховищі є список для блоку X, ми його малюємо ОДРАЗУ.
    blocks.forEach((selector, index) => {
        const container = document.querySelector(selector);
        if (container) {
            renderListForBlock(container, index);
        }
    });

    links.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            link.focus();
        });

        link.addEventListener('focus', () => {
            const blockIndex = index % blocks.length;
            const targetBlock = document.querySelector(blocks[blockIndex]);

            if (targetBlock) {
                moveFormToBlock(targetBlock, blockIndex);
            }
        });
    });

    function moveFormToBlock(container, blockIndex) {
        const oldForm = document.getElementById('listCreationForm');
        if (oldForm) oldForm.remove();

        const formDiv = document.createElement('div');
        formDiv.id = 'listCreationForm';
        formDiv.style.padding = '10px';
        formDiv.style.background = '#2a2a2a';
        formDiv.style.border = '1px solid #08c5de';
        formDiv.style.margin = '10px 0';

        formDiv.innerHTML = `
            <div style="font-size: 14px; margin-bottom:5px; color: #fff;">Список для Блоку ${blockIndex + 1}</div>
            <input type="text" id="listItemInput" placeholder="Новий пункт..." style="padding: 5px;">
            <button id="addBtn" style="cursor: pointer;">+</button>
        `;
        if (container.classList.contains('block2')) {
            container.appendChild(formDiv);
        } else {
            container.prepend(formDiv);
        }

        const input = document.getElementById('listItemInput');
        input.focus();

        document.getElementById('addBtn').addEventListener('click', () => {
            if (input.value.trim()) {
                addItemToBlock(blockIndex, input.value.trim());
                renderListForBlock(container, blockIndex); // Оновлюємо вигляд цього блоку
                input.value = '';
                input.focus();
            }
        });
    }

    function getAllLists() {
        // Структура: { "0": ["item1"], "1": ["itemA", "itemB"], ... }
        return JSON.parse(localStorage.getItem('allBlocksLists') || '{}');
    }

    function addItemToBlock(blockIndex, text) {
        const allLists = getAllLists();
        if (!allLists[blockIndex]) {
            allLists[blockIndex] = [];
        }
        allLists[blockIndex].push(text);
        localStorage.setItem('allBlocksLists', JSON.stringify(allLists));
    }

    function removeItemFromBlock(blockIndex, itemIndex) {
        const allLists = getAllLists();
        if (allLists[blockIndex]) {
            allLists[blockIndex].splice(itemIndex, 1);
            if (allLists[blockIndex].length === 0) {
                delete allLists[blockIndex];
            }
            localStorage.setItem('allBlocksLists', JSON.stringify(allLists));
        }
    }

    function renderListForBlock(container, blockIndex) {
        const allLists = getAllLists();
        const items = allLists[blockIndex] || [];

        let listContainerId = `dynamicList-${blockIndex}`;
        let ol = document.getElementById(listContainerId);

        const hasItems = items.length > 0;

        Array.from(container.children).forEach(child => {

            if (child.id === 'listCreationForm' || child.id === listContainerId) return;

            const isNavigation = child.tagName === 'BUTTON' || (child.tagName === 'UL' && container.classList.contains('block2'));

            if (hasItems && !isNavigation) {
                child.style.display = 'none';
                child.setAttribute('data-hidden', 'true');
            } else if (!hasItems && child.getAttribute('data-hidden')) {
                child.style.display = '';
                child.removeAttribute('data-hidden');
            }
        });

        if (!ol && hasItems) {
            ol = document.createElement('ol');
            ol.id = listContainerId;
            ol.style.textAlign = 'left';
            ol.style.marginTop = '10px';
            container.appendChild(ol);
        }

        if (!hasItems && ol) {
            ol.remove();
            return;
        }

        if (hasItems) {
            ol.innerHTML = '';
            items.forEach((text, itemIndex) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${text}</span>`;
                li.style.marginBottom = '5px';

                const delBtn = document.createElement('button');
                delBtn.innerText = 'x';
                delBtn.style.marginLeft = '10px';
                delBtn.style.color = 'red';
                delBtn.style.padding = '0 5px';
                delBtn.style.border = '1px solid red';

                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeItemFromBlock(blockIndex, itemIndex);
                    renderListForBlock(container, blockIndex);
                });

                li.appendChild(delBtn);
                ol.appendChild(li);
            });
        }
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
})