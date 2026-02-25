import { getSelected, HTMLDisplay } from "./script.js"

const actions = {
    mean: (arr, c, t, d) => mean(arr, c, t, d),
    stanDevPopulation: (arr, c, t) => stanDevPopulation(arr, c, t),
    stanDevSample: (arr, c, t) => stanDevSample(arr, c, t),
    zScore: (arr, c, t) => zScore(arr, c, t),
    range: (arr, c, t) => Range(arr, c, t),
    varPopulation: (arr, c, t) => varPopulation(arr, c, t),
    varSample: (arr, c, t) => varSample(arr, c, t),
    skewSample: (arr, c, t) => skewSample(arr, c, t),
    skewPopulation: (arr, c, t) => skewPopulation(arr, c, t),
    covarPopulation: (arr, c, t, d) => covarPopulation(arr, c, t),
    covarSample: (arr, c, t, d) => covarSample(arr, c, t),
    correlationCoPopulation: (arr, c, t, d) => correlationCoPopulation(arr, c, t, d),
   correlationCoSample: (arr, c, t, d) =>correlationCoSample(arr, c, t, d)
};


const arrayFixing = () => {
    const inputElement = document.getElementById('inputValue');
    const inputValue = inputElement?.value || '';

    const inputArray = inputValue.trim().split(/\s+/);

    if (inputArray.length === 0 || inputArray[0] === "") {
        HTMLDisplay("Please input a tuple like (x, y)");
        return null;
    }

    const matches = [...inputValue.matchAll(/\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g)];

    if (matches.length === 0) {
        HTMLDisplay("Please input tuples like (x, y); perhaps you meant to analyse one-dimensional datasets. Lest this be the case, please untick the Multi-Dimensional checkbox");
        return;
    }

    const tupleArray = matches.map(match => ({
        x: Number(match[1]),
        y: Number(match[2])
    }));

    if (tupleArray.some(t => Number.isNaN(t.x) || Number.isNaN(t.y))) {
        HTMLDisplay("Please input a number therein");
        return;
    }

    const type = getSelected(true);

    tupleArray.sort((a, b) => a.x - b.x);

    const resultObject = {};
    tupleArray.forEach(t => {
        resultObject[t.x] = t.y;
    });

    console.log(resultObject);
    console.log(tupleArray);
    console.log(tupleArray.length);
    console.log(type)

    if (actions[type]) {
        actions[type](resultObject, tupleArray.length, true, 'x');
    }
};

const mean = (resultObject, count, display, component) => {
    let sumX = 0;
    let sumY = 0;
    Object.keys(resultObject).forEach(item => {
        sumX += Number(item);
    });
    Object.values(resultObject).forEach(item => {
        sumY += Number(item);
    });
    const averageX = sumX / count;
    const averageY = sumY / count;
    
    if (display == true) {
        HTMLDisplay(`${averageX} and ${averageY}`);
        return;
    };

    if (component == 'x') {
        return averageX;
    } else if (component == 'y') {
        return averageY;
    } else {
        return averageX && averageY;
    }
};

const standDev = (resultObject, count, component) => {
    const mu = mean(resultObject, count, false, component);
    let sum = 0;
    if (component == 'x') {
        sum = Object.keys(resultObject).reduce((acc, item) => acc + (item - mu) ** 2, 0);
    } else if (component == 'y') {
        sum = Object.values(resultObject).reduce((acc, item) => acc + (item - mu) ** 2, 0);
    }
    return sum;
}

const stanDevPopulation = (resultObject, count, display, component) => {
    const sumX = standDev(resultObject, count, "x");
    const sumY = standDev(resultObject, count, "y");
    const totalX = Math.sqrt(sumX / count);
    const totalY = Math.sqrt(sumY / count);
    // console.log(total);
    if (display == true) {
        HTMLDisplay(`${totalX} and ${totalY}`);
        return;
    };
    if (component == 'x') {
        return totalX;
    } else if (component == 'y') {
        return totalY;
    } else {
        return totalX && totalY;
    }
}

const stanDevSample = (resultObject, count, display, component) => {
    const sumX = standDev(resultObject, count, "x");
    const sumY = standDev(resultObject, count, "y");
    const totalX = Math.sqrt(sumX / (count - 1));
    const totalY = Math.sqrt(sumY / (count - 1));
    // console.log(total);
    if (display == true) {
        HTMLDisplay(`${totalX} and ${totalY}`);
        return;
    };
    if (component == 'x') {
        return totalX;
    } else if (component == 'y') {
        return totalY;
    } else {
        return totalX && totalY;
    }
}

const covar = (resultObject, count) => {
    console.log("r")
    const sum = Object.entries(resultObject).reduce((acc, [key, value]) => { 
        return acc + (Number(key) - mean(resultObject, count, false, 'x')) * (Number(value) - mean(resultObject, count, false, 'y'));
    }, 0);
    return sum;
};

const covarPopulation = (resultObject, count, display, _component) => {
    console.log("q")
    const sum = covar(resultObject, count);
    const total = sum / count;
    console.log(total)
    if (display == true) {
        HTMLDisplay(total);
        return;
    };
    return total;
};

const covarSample = (resultObject, count, display, _component) => {
    console.log("w")
    const sum = covar(resultObject, count);
    const total = sum / (count - 1);
    console.log(total)
    if (display == true) {
        HTMLDisplay(total);
        return;
    };
    return total;
};

const correlationCoSample = (resultObject, count, display, _component) => {
    const covariance = covarSample(resultObject, count, false);
    const standardX = stanDevSample(resultObject, count, false, "x");
    const standardY = stanDevSample(resultObject, count, false, "y");
    const total = (covariance) / (standardX * standardY);
    if (display == true) {
        HTMLDisplay(total);
        return;
    };
    return total;
}

const correlationCoPopulation = (resultObject, count, display, _component) => {
    const covariance = covarPopulation(resultObject, count, false);
    const standardX = stanDevPopulation(resultObject, count, false, "x");
    const standardY = stanDevPopulation(resultObject, count, false, "y");
    const total = (covariance) / (standardX * standardY);
    if (display == true) {
        HTMLDisplay(total);
        return;
    };
    return total;
}

const solveButton = document.getElementById('generateMulti')

solveButton.addEventListener("click",  () => { arrayFixing() });
