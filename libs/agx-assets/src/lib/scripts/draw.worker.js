// standalone worker
const insideWorker = (listener) => {
  if (typeof window !== 'object') {
    onmessage = listener;
    return {
      post: function (a, b) {
        postMessage(a, b);
      },
      isWorker: true,
    };
  } else {
    var randomId = document.currentScript.dataset.id;
    var connection = window[randomId];
    delete window[randomId];

    connection.worker = listener;

    setTimeout(function () {
      connection.msgs.forEach(function (data) {
        connection.worker({ data: data });
      });
    }, 1);

    return {
      post: function (data) {
        connection.host({ data: data });
      },
      isWorker: false,
    };
  }
};

let workerCanvas = null;
let workerCtx = null;

insideWorker((data) => {
  switch (data.type) {
    case 'canvas': {
      const { canvas } = data;
      workerCanvas = canvas;
      workerCtx = canvas.getContext('2d');
      break;
    }
    case 'draw': {
      const { line } = data;
      if (workerCtx) {
        const from = line.points[data?.line.points.length - 2];
        const to = line.points[data?.line.points.length - 1];
        workerCtx.beginPath();
        workerCtx.moveTo(from.x, from.y);
        workerCtx.lineTo(to.x, to.y);
        workerCtx.closePath();
        workerCtx.stroke();
      }
      break;
    }
    case 'attributes': {
      const { attributes } = data;
      if (workerCtx) {
        workerCtx.lineCap = attributes.lineCap;
        workerCtx.lineJoin = attributes.lineJoin;
        workerCtx.lineWidth = attributes.lineWidth;
        workerCtx.strokeStyle = attributes.strokeStyle;
      }
      break;
    }
    case 'reset': {
      workerCtx?.clearRect(0, 0, workerCanvas.width, workerCanvas.height);
      break;
    }
    case 'resize': {
      const { size } = data;
      if (workerCtx) {
        workerCanvas.width = size.x;
        workerCanvas.height = size.y;
        workerCanvas.style.width = `${size.x}px`;
        workerCanvas.style.height = `${size.y}px`;
        workerCtx?.clearRect(0, 0, workerCanvas.width, workerCanvas.height);
      }
      break;
    }
    default:
      break;
  }

  // console.log(`drew from: ${from.x}:${from.y} to: ${to.x}:${to.y}`);
  // postresponse);
});
