const actions = {
    mean: (arr, c, t) => mean(arr, c, t),
    stanDevPopulation: (arr, c, t) => stanDevPopulation(arr, c, t),
    stanDevSample: (arr, c, t) => stanDevSample(arr, c, t),
    zScore: (arr, c, t) => zScore(arr, c, t),
    range: (arr, c, t) => Range(arr, c, t),
    varPopulation: (arr, c, t) => varPopulation(arr, c, t),
    varSample: (arr, c, t) => varSample(arr, c, t),
    skewSample: (arr, c, t) => skewSample(arr, c, t),
    skewPopulation: (arr, c, t) => skewPopulation(arr, c, t)
}; 

export function getSelected(mulitDimensional) {
    let selectElement;
    selectElement = mulitDimensional ? document.getElementById("typeMulti") : document.getElementById("type");
    const selectValue = selectElement.value;
    if (selectValue == '') {
        HTMLDisplay("Please select your method");
        return;
    }
    return selectValue;
}

const sort = (type, numberArray) => {
    if (type != "zScore") {
        const sortedArray = [...numberArray].sort((a, b) => a - b)
        return sortedArray;
    } else {
        const sortedArray = numberArray[0] ? [numberArray[0], ...numberArray.slice(1).sort()] : [...numberArray].sort();
        return sortedArray
    };
};

export function HTMLDisplay(value) {
    const returnValue = document.getElementById("returnValue")
    let labeller = "Result: "
    value = String(value);
    if (value.includes("Please" || "please")) {
        labeller = "";
    } 
    returnValue.innerHTML = `${labeller + value}`;
}

const arrayFixing = () => {
    const inputElement = document.getElementById('inputValue');
    const inputValue = inputElement?.value || '';
    const inputArray = inputValue.trim().split(/\s+/);
    if (inputArray == '') {
        HTMLDisplay("Please input a number therein")
        return;
    }

    const residue = ",";
    const residueArray = inputArray.map(item => {
        return item.replace(new RegExp(residue, "g"), "");
    });

    if (residueArray.some(item => item.includes(")") || item.includes("("))) {
        HTMLDisplay("Please input an array therein; perhaps you meant to analyse mulitdimensional datasets. Lest this be the case, please tick the Multi-dimensional box");
        return;
    }

    const numberArray = residueArray.map(Number);
    if (numberArray.includes(NaN) == true) {
        HTMLDisplay("Please input a number therein")
        inputElement.value = numberArray.filter(item => !Number.isNaN(item));
        return;
    }

    const type = getSelected(false);
    const sortedArray = sort(type, numberArray);

    const count = sortedArray.length;

    console.log(count);
    console.log(sortedArray)


    if (actions[type]) {
        actions[type](sortedArray, count, true);
    }
};

const solveButton = document.getElementById('generate')

solveButton.addEventListener("click",  () => { arrayFixing() });


const Range = (sortedArray, _count, display) => {
    const range = Math.max(...sortedArray) - Math.min(...sortedArray);
    // console.log(range);
    if (display == true) {
        HTMLDisplay(range);
        return;
    };
    return range;
};

const mean = (sortedArray, count, display) => {
    let sum = 0;
    sortedArray.forEach(item => {
        sum += item;
    });
    const average = sum / count;
    console.log(average);
    if (display == true) {
        HTMLDisplay(average);
        return;
    };
    return average;
}

const standDev = (sortedArray, count) => {
    const mu = mean(sortedArray, count, false);
    const sum = sortedArray.reduce((acc, item) => acc + (item - mu) ** 2, 0);
    return sum;
}

const standDevPercent = (sortedArray, count, value) => {
    const average = mean(sortedArray, count, false)
    const percent = `${value} or ${(100 * value) / average}%`
    return percent;
};

const stanDevPopulation = (sortedArray, count, display) => {
    const sum = standDev(sortedArray, count);
    const total = Math.sqrt(sum / count);
    // console.log(total);
    const percent = standDevPercent(sortedArray, count, total);
    if (display == true) {
        HTMLDisplay(percent);
        return;
    };
    return total;
};

const stanDevSample = (sortedArray, count, display) => {
    const sum = standDev(sortedArray, count);
    const total = Math.sqrt(sum / (count - 1 ));
    const percent = standDevPercent(sortedArray, count, total);
    if (display == true) {
        HTMLDisplay(percent);
        return;
    };
    console.log(total);
    return total;
};

const varPopulation = (sortedArray, count, display) => {
    const total = (stanDevPopulation(sortedArray, count, false)) ** 2;
    if (display == true) {
        HTMLDisplay(total);
        return;
    };
    return total;
}

const varSample = (sortedArray, count, display) => {
    const total = (stanDevSample(sortedArray, count, false)) ** 2;
    if (display == true) {
        HTMLDisplay(total);
        return;
    };
    return total;
}

const zScore = (sortedArray, count, display) => {
    const comparedValue = sortedArray[0];
    const sum = stanDevPopulation(sortedArray, count);
    const average = mean(sortedArray, count, false);
    const total = (comparedValue - average) / (sum);
    if (display == true) {
        HTMLDisplay(total);
        return;
    };
    // console.log(total);
    return total;
}

const skewPopulation = (sortedArray, count, display) => {
    const stand = stanDevPopulation(sortedArray, count, false);
    const mu = mean(sortedArray, count, false);
    const thirdCentral = sortedArray.reduce((acc, item) => (acc + ((item - mu) ** 3)), 0);
    const total = (thirdCentral / count) / (stand ** 3);
    if (display == true) {
        HTMLDisplay(total);
        return;
    };
    return total;
};

const skewSample = (sortedArray, count, display) => {
    const factor = count / ((count - 1)*(count-2));
    const stand = stanDevSample(sortedArray, count, false);
    const mu = mean(sortedArray, count, false);
    const thirdCentral = sortedArray.reduce((acc, item) => acc + ((item - mu) ** 3), 0);
    const total = factor * (thirdCentral / (stand ** 3));
    if (display == true) {
        HTMLDisplay(total);
        return;
    };
    return total;
}

// const EXV = (sortedArray, count, display) => {
    
// };