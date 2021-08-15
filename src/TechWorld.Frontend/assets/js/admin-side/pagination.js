//selecting required loadPagination
const ulTag = document.querySelector(".pagination ul");


function loadPagination(totalPage, pageIndex) {
    let liTag = '';
    let activeLi;
    let beforePage = pageIndex - 1;
    let afterPage = pageIndex + 1;
    if (pageIndex > 1) { //If pageIndex value is greater than 1 then add new li which show the previous button
        liTag += `<li class=" btn-pagination prev" onclick="onClickPageIndex(${beforePage})"><span><i class="fas fa-angle-left">Previous</i></span></li>`
    }
    if (totalPage > 4) {
        if (pageIndex > 2) { //If pageIndex value is greater than 2 then add new li tag with value 1
            liTag += `<li class="numb" onclick="onClickPageIndex(1)"><span>1</span></li>`;
            if (pageIndex > 3) { //If pageIndex value is greater than 2 then add new li tag with value (...)
                liTag += `<li class="dots"><span>...</span></li>`;
            }
        }
    }
    //how many page or li show before the current li
    if (pageIndex == totalPage) {
        beforePage = beforePage - 2;
    } else if (pageIndex == totalPage - 1) {
        beforePage = beforePage - 1
    }

    //how many page or li show after the current li
    if (pageIndex == 1) {
        afterPage = afterPage + 2;
    } else if (pageIndex == 2) {
        afterPage = afterPage + 1
    }

    for (let currentPage = beforePage; currentPage <= afterPage; currentPage++) {
        if (currentPage == 0) {
            currentPage = currentPage + 1;
        }
        if (currentPage < 1)
            continue;
        if (currentPage > totalPage) {
            continue;
        }
        if (pageIndex == currentPage) { //if pageIndex value is equal to currentPage then assign the active string in the activeLi variable
            activeLi = "active";
        } else {
            activeLi = '';
        }
        liTag += `<li class="numb ${activeLi}" onclick="onClickPageIndex(${currentPage})"><span>${currentPage}</span></li>`;
    }

    if (totalPage > 4) {
        if (pageIndex < totalPage - 1) { //If pageIndex value is less than totalPage -1 then show the last li or pageIndex which is totalPage
            if (pageIndex < totalPage - 2) { //If pageIndex value is less than totalPage -1 then show the last (...) before last pageIndex
                liTag += `<li class="dots"><span>...</span></li>`;
            }
            liTag += `<li class="numb" onclick="onClickPageIndex(${totalPage})"><span>${totalPage}</span></li>`;
        }
    }

    if (pageIndex < totalPage) { //If pageIndex value is less than totalPage values then add new li which show the next button
        afterPage = pageIndex + 1;
        liTag += `<li class="btn-pagination next" onclick="onClickPageIndex(${afterPage})"><span>Next<i class="fas fa-angle-right"></i></span></li>`
    }
    ulTag.innerHTML = liTag;
}