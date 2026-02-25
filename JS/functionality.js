const select = document.getElementById('type');
const dimensions = document.getElementById('multiDimensional')

select.addEventListener('keydown', function(e) {
    let typed = e.key.toLowerCase();
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().startsWith(typed)) {
            select.selectedIndex = i;
            break;
        }
    }
});

const typeSingle = document.getElementById('type');
const generateSingle = document.getElementById('generate')
const typeMulti = document.getElementById('typeMulti')
const generateMulti = document.getElementById('generateMulti')

dimensions.addEventListener('change', function() {
    if (this.checked) {
        [typeSingle, generateSingle].forEach(Element => Element.style.display = "none");
        [typeMulti, generateMulti].forEach(Element => Element.style.display = "inline-block");
    } else {
        [typeSingle, generateSingle].forEach(Element => Element.style.display = "inline-block");
        [typeMulti, generateMulti].forEach(Element => Element.style.display = "none");
    }
})