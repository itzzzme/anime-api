//inspired from https://github.com/drblgn/rabbit_wasm

import util from "util";
import pixels from "image-pixels";
import cryptoJs from "crypto-js";
import axios from "axios";
const user_agent =
  "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0";
import { webcrypto } from "crypto";
const crypto = webcrypto;
import { dataURL } from "../../configs/dataUrl.js";
import { v1_base_url } from "../../utils/base_v1.js";

let wasm;
let arr = new Array(128).fill(void 0);
const dateNow = Date.now();
let content;
let referrer = "";

function isDetached(buffer) {
  if (buffer.byteLength === 0) {
    const formatted = util.format(buffer);
    return formatted.includes("detached");
  }
  return false;
}

const meta = {
  content: content,
};

const image_data = {
  height: 50,
  width: 65,
  data: new Uint8ClampedArray(),
};

const canvas = {
  baseUrl: "",
  width: 0,
  height: 0,
  style: {
    style: {
      display: "inline",
    },
  },
  context2d: {},
};

const fake_window = {
  localStorage: {
    setItem: function (item, value) {
      fake_window.localStorage[item] = value;
    },
  },
  navigator: {
    webdriver: false,
    userAgent: user_agent,
  },
  length: 0,
  document: {
    cookie: "",
  },
  origin: "",
  location: {
    href: "",
    origin: "",
  },
  performance: {
    timeOrigin: dateNow,
  },
  xrax: "",
  c: false,
  G: "",
  z: function (a) {
    return [
      (4278190080 & a) >> 24,
      (16711680 & a) >> 16,
      (65280 & a) >> 8,
      255 & a,
    ];
  },
  crypto: crypto,
  msCrypto: crypto,
  browser_version: 1676800512,
};

const nodeList = {
  image: {
    src: "",
    height: 50,
    width: 65,
    complete: true,
  },
  context2d: {},
  length: 1,
};

function get(index) {
  return arr[index];
}

arr.push(void 0, null, true, false);

let size = 0;
let memoryBuff;

function getMemBuff() {
  return (memoryBuff =
    null !== memoryBuff && 0 !== memoryBuff.byteLength
      ? memoryBuff
      : new Uint8Array(wasm.memory.buffer));
}

const encoder = new TextEncoder();
const encode = function (text, array) {
  return encoder.encodeInto(text, array);
};

function parse(text, func, func2) {
  if (void 0 === func2) {
    var encoded = encoder.encode(text);
    const parsedIndex = func(encoded.length, 1) >>> 0;
    return (
      getMemBuff()
        .subarray(parsedIndex, parsedIndex + encoded.length)
        .set(encoded),
      (size = encoded.length),
      parsedIndex
    );
  }
  let len = text.length;
  let parsedLen = func(len, 1) >>> 0;
  var new_arr = getMemBuff();
  let i = 0;
  for (; i < len; i++) {
    var char = text.charCodeAt(i);
    if (127 < char) {
      break;
    }
    new_arr[parsedLen + i] = char;
  }
  return (
    i !== len &&
      (0 !== i && (text = text.slice(i)),
      (parsedLen = func2(parsedLen, len, (len = i + 3 * text.length), 1) >>> 0),
      (encoded = getMemBuff().subarray(parsedLen + i, parsedLen + len)),
      (i += encode(text, encoded).written),
      (parsedLen = func2(parsedLen, len, i, 1) >>> 0)),
    (size = i),
    parsedLen
  );
}

let dataView;

function isNull(test) {
  return null == test;
}

function getDataView() {
  return (dataView =
    dataView === null ||
    isDetached(dataView.buffer) ||
    dataView.buffer !== wasm.memory.buffer
      ? new DataView(wasm.memory.buffer)
      : dataView);
}

let pointer = arr.length;

function shift(QP) {
  QP < 132 || ((arr[QP] = pointer), (pointer = QP));
}

function shiftGet(QP) {
  var Qn = get(QP);
  return shift(QP), Qn;
}

const decoder = new TextDecoder("utf-8", {
  fatal: true,
  ignoreBOM: true,
});

function decodeSub(index, offset) {
  return (
    (index >>>= 0), decoder.decode(getMemBuff().subarray(index, index + offset))
  );
}

function addToStack(item) {
  pointer === arr.length && arr.push(arr.length + 1);
  var Qn = pointer;
  return (pointer = arr[Qn]), (arr[Qn] = item), Qn;
}

function args(QP, Qn, QT, func) {
  const Qx = {
    a: QP,
    b: Qn,
    cnt: 1,
    dtor: QT,
  };
  return (
    (QP = (...Qw) => {
      Qx.cnt++;
      try {
        return func(Qx.a, Qx.b, ...Qw);
      } finally {
        0 == --Qx.cnt &&
          (wasm.__wbindgen_export_2.get(Qx.dtor)(Qx.a, Qx.b), (Qx.a = 0));
      }
    }),
    ((QP.original = Qx), QP)
  );
}

function export3(QP, Qn) {
  return shiftGet(wasm.__wbindgen_export_3(QP, Qn));
}

function export4(Qy, QO, QX) {
  wasm.__wbindgen_export_4(Qy, QO, addToStack(QX));
}

function export5(QP, Qn) {
  wasm.__wbindgen_export_5(QP, Qn);
}

function applyToWindow(func, args) {
  try {
    return func.apply(fake_window, args);
  } catch (error) {
    wasm.__wbindgen_export_6(addToStack(error));
  }
}

function Qj(QP, Qn) {
  return (
    (Qn = Qn(+QP.length, 1) >>> 0),
    (getMemBuff().set(QP, Qn), (size = QP.length), Qn)
  );
}

async function QN(QP, Qn) {
  let QT, Qt;
  return "function" == typeof Response && QP instanceof Response
    ? ((QT = await QP.arrayBuffer()),
      (Qt = await WebAssembly.instantiate(QT, Qn)),
      Object.assign(Qt, { bytes: QT }))
    : (Qt = await WebAssembly.instantiate(QP, Qn)) instanceof
      WebAssembly.Instance
    ? {
        instance: Qt,
        module: QP,
      }
    : Qt;
}

function initWasm() {
  const wasmObj = {
    wbg: {
      __wbindgen_is_function: function (index) {
        return typeof get(index) == "function";
      },
      __wbindgen_is_string: function (index) {
        return typeof get(index) == "string";
      },
      __wbindgen_is_object: function (index) {
        let object = get(index);
        return typeof object == "object" && object !== null;
      },
      __wbindgen_number_get: function (offset, index) {
        let number = get(index);
        getDataView().setFloat64(offset + 8, isNull(number) ? 0 : number, true);
        getDataView().setInt32(offset, isNull(number) ? 0 : 1, true);
      },
      __wbindgen_string_get: function (offset, index) {
        let str = get(index);
        let val = parse(
          str,
          wasm.__wbindgen_export_0,
          wasm.__wbindgen_export_1
        );
        getDataView().setInt32(offset + 4, size, true);
        getDataView().setInt32(offset, val, true);
      },
      __wbindgen_object_drop_ref: function (index) {
        shiftGet(index);
      },
      __wbindgen_cb_drop: function (index) {
        let org = shiftGet(index).original;
        return 1 == org.cnt-- && !(org.a = 0);
      },
      __wbindgen_string_new: function (index, offset) {
        return addToStack(decodeSub(index, offset));
      },
      __wbindgen_is_null: function (index) {
        return null === get(index);
      },
      __wbindgen_is_undefined: function (index) {
        return void 0 === get(index);
      },
      __wbindgen_boolean_get: function (index) {
        let bool = get(index);
        return "boolean" == typeof bool ? (bool ? 1 : 0) : 2;
      },
      __wbg_instanceof_CanvasRenderingContext2d_4ec30ddd3f29f8f9: function () {
        return true;
      },
      __wbg_subarray_adc418253d76e2f1: function (index, num1, num2) {
        return addToStack(get(index).subarray(num1 >>> 0, num2 >>> 0));
      },
      __wbg_randomFillSync_5c9c955aa56b6049: function () {},
      __wbg_getRandomValues_3aa56aa6edec874c: function () {
        return applyToWindow(function (index1, index2) {
          get(index1).getRandomValues(get(index2));
        }, arguments);
      },
      __wbg_msCrypto_eb05e62b530a1508: function (index) {
        return addToStack(get(index).msCrypto);
      },
      __wbg_toString_6eb7c1f755c00453: function (index) {
        let fakestr = "[object Storage]";
        return addToStack(fakestr);
      },
      __wbg_toString_139023ab33acec36: function (index) {
        return addToStack(get(index).toString());
      },
      __wbg_require_cca90b1a94a0255b: function () {
        return applyToWindow(function () {
          return addToStack(module.require);
        }, arguments);
      },
      __wbg_crypto_1d1f22824a6a080c: function (index) {
        return addToStack(get(index).crypto);
      },
      __wbg_process_4a72847cc503995b: function (index) {
        return addToStack(get(index).process);
      },
      __wbg_versions_f686565e586dd935: function (index) {
        return addToStack(get(index).versions);
      },
      __wbg_node_104a2ff8d6ea03a2: function (index) {
        return addToStack(get(index).node);
      },
      __wbg_localStorage_3d538af21ea07fcc: function () {
        return applyToWindow(function (index) {
          let data = fake_window.localStorage;
          if (isNull(data)) {
            return 0;
          } else {
            return addToStack(data);
          }
        }, arguments);
      },
      __wbg_setfillStyle_59f426135f52910f: function () {},
      __wbg_setshadowBlur_229c56539d02f401: function () {},
      __wbg_setshadowColor_340d5290cdc4ae9d: function () {},
      __wbg_setfont_16d6e31e06a420a5: function () {},
      __wbg_settextBaseline_c3266d3bd4a6695c: function () {},
      __wbg_drawImage_cb13768a1bdc04bd: function () {},
      __wbg_getImageData_66269d289f37d3c7: function () {
        return applyToWindow(function () {
          return addToStack(image_data);
        }, arguments);
      },
      __wbg_rect_2fa1df87ef638738: function () {},
      __wbg_fillRect_4dd28e628381d240: function () {},
      __wbg_fillText_07e5da9e41652f20: function () {},
      __wbg_setProperty_5144ddce66bbde41: function () {},
      __wbg_createElement_03cf347ddad1c8c0: function () {
        return applyToWindow(function (index, decodeIndex, decodeIndexOffset) {
          return addToStack(canvas);
        }, arguments);
      },
      __wbg_querySelector_118a0639aa1f51cd: function () {
        return applyToWindow(function (index, decodeIndex, decodeOffset) {
          return addToStack(meta);
        }, arguments);
      },
      __wbg_querySelectorAll_50c79cd4f7573825: function () {
        return applyToWindow(function () {
          return addToStack(nodeList);
        }, arguments);
      },
      __wbg_getAttribute_706ae88bd37410fa: function (
        offset,
        index,
        decodeIndex,
        decodeOffset
      ) {
        let attr = meta.content;
        let todo = isNull(attr)
          ? 0
          : parse(attr, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        getDataView().setInt32(offset + 4, size, true);
        getDataView().setInt32(offset, todo, true);
      },
      __wbg_target_6795373f170fd786: function (index) {
        let target = get(index).target;
        return isNull(target) ? 0 : addToStack(target);
      },
      __wbg_addEventListener_f984e99465a6a7f4: function () {},
      __wbg_instanceof_HtmlCanvasElement_1e81f71f630e46bc: function () {
        return true;
      },
      __wbg_setwidth_233645b297bb3318: function (index, set) {
        get(index).width = set >>> 0;
      },
      __wbg_setheight_fcb491cf54e3527c: function (index, set) {
        get(index).height = set >>> 0;
      },
      __wbg_getContext_dfc91ab0837db1d1: function () {
        return applyToWindow(function (index) {
          return addToStack(get(index).context2d);
        }, arguments);
      },
      __wbg_toDataURL_97b108dd1a4b7454: function () {
        return applyToWindow(function (offset, index) {
          let _dataUrl = parse(
            dataURL,
            wasm.__wbindgen_export_0,
            wasm.__wbindgen_export_1
          );
          getDataView().setInt32(offset + 4, size, true);
          getDataView().setInt32(offset, _dataUrl, true);
        }, arguments);
      },
      __wbg_instanceof_HtmlDocument_1100f8a983ca79f9: function () {
        return true;
      },
      __wbg_style_ca229e3326b3c3fb: function (index) {
        addToStack(get(index).style);
      },
      __wbg_instanceof_HtmlImageElement_9c82d4e3651a8533: function () {
        return true;
      },
      __wbg_src_87a0e38af6229364: function (offset, index) {
        let _src = parse(
          get(index).src,
          wasm.__wbindgen_export_0,
          wasm.__wbindgen_export_1
        );
        getDataView().setInt32(offset + 4, size, true);
        getDataView().setInt32(offset, _src, true);
      },
      __wbg_width_e1a38bdd483e1283: function (index) {
        return get(index).width;
      },
      __wbg_height_e4cc2294187313c9: function (index) {
        return get(index).height;
      },
      __wbg_complete_1162c2697406af11: function (index) {
        return get(index).complete;
      },
      __wbg_data_d34dc554f90b8652: function (offset, index) {
        var _data = Qj(get(index).data, wasm.__wbindgen_export_0);
        getDataView().setInt32(offset + 4, size, true);
        getDataView().setInt32(offset, _data, true);
      },
      __wbg_origin_305402044aa148ce: function () {
        return applyToWindow(function (offset, index) {
          let _origin = parse(
            get(index).origin,
            wasm.__wbindgen_export_0,
            wasm.__wbindgen_export_1
          );
          getDataView().setInt32(offset + 4, size, true);
          getDataView().setInt32(offset, _origin, true);
        }, arguments);
      },
      __wbg_length_8a9352f7b7360c37: function (index) {
        return get(index).length;
      },
      __wbg_get_c30ae0782d86747f: function (index) {
        let _image = get(index).image;
        return isNull(_image) ? 0 : addToStack(_image);
      },
      __wbg_timeOrigin_f462952854d802ec: function (index) {
        return get(index).timeOrigin;
      },
      __wbg_instanceof_Window_cee7a886d55e7df5: function () {
        return true;
      },
      __wbg_document_eb7fd66bde3ee213: function (index) {
        let _document = get(index).document;
        return isNull(_document) ? 0 : addToStack(_document);
      },
      __wbg_location_b17760ac7977a47a: function (index) {
        return addToStack(get(index).location);
      },
      __wbg_performance_4ca1873776fdb3d2: function (index) {
        let _performance = get(index).performance;
        return isNull(_performance) ? 0 : addToStack(_performance);
      },
      __wbg_origin_e1f8acdeb3a39a2b: function (offset, index) {
        let _origin = parse(
          get(index).origin,
          wasm.__wbindgen_export_0,
          wasm.__wbindgen_export_1
        );
        getDataView().setInt32(offset + 4, size, true);
        getDataView().setInt32(offset, _origin, true);
      },
      __wbg_get_8986951b1ee310e0: function (index, decode1, decode2) {
        let data = get(index)[decodeSub(decode1, decode2)];
        return isNull(data) ? 0 : addToStack(data);
      },
      __wbg_setTimeout_6ed7182ebad5d297: function () {
        return applyToWindow(function () {
          return 7;
        }, arguments);
      },
      __wbg_self_05040bd9523805b9: function () {
        return applyToWindow(function () {
          return addToStack(fake_window);
        }, arguments);
      },
      __wbg_window_adc720039f2cb14f: function () {
        return applyToWindow(function () {
          return addToStack(fake_window);
        }, arguments);
      },
      __wbg_globalThis_622105db80c1457d: function () {
        return applyToWindow(function () {
          return addToStack(fake_window);
        }, arguments);
      },
      __wbg_global_f56b013ed9bcf359: function () {
        return applyToWindow(function () {
          return addToStack(fake_window);
        }, arguments);
      },
      __wbg_newnoargs_cfecb3965268594c: function (index, offset) {
        return addToStack(new Function(decodeSub(index, offset)));
      },
      __wbindgen_object_clone_ref: function (index) {
        return addToStack(get(index));
      },
      __wbg_eval_c824e170787ad184: function () {
        return applyToWindow(function (index, offset) {
          let fake_str = "fake_" + decodeSub(index, offset);
          let ev = eval(fake_str);
          return addToStack(ev);
        }, arguments);
      },
      __wbg_call_3f093dd26d5569f8: function () {
        return applyToWindow(function (index, index2) {
          return addToStack(get(index).call(get(index2)));
        }, arguments);
      },
      __wbg_call_67f2111acd2dfdb6: function () {
        return applyToWindow(function (index, index2, index3) {
          return addToStack(get(index).call(get(index2), get(index3)));
        }, arguments);
      },
      __wbg_set_961700853a212a39: function () {
        return applyToWindow(function (index, index2, index3) {
          return Reflect.set(get(index), get(index2), get(index3));
        }, arguments);
      },
      __wbg_buffer_b914fb8b50ebbc3e: function (index) {
        return addToStack(get(index).buffer);
      },
      __wbg_newwithbyteoffsetandlength_0de9ee56e9f6ee6e: function (
        index,
        val,
        val2
      ) {
        return addToStack(new Uint8Array(get(index), val >>> 0, val2 >>> 0));
      },
      __wbg_newwithlength_0d03cef43b68a530: function (length) {
        return addToStack(new Uint8Array(length >>> 0));
      },
      __wbg_new_b1f2d6842d615181: function (index) {
        return addToStack(new Uint8Array(get(index)));
      },
      __wbg_buffer_67e624f5a0ab2319: function (index) {
        return addToStack(get(index).buffer);
      },
      __wbg_length_21c4b0ae73cba59d: function (index) {
        return get(index).length;
      },
      __wbg_set_7d988c98e6ced92d: function (index, index2, val) {
        get(index).set(get(index2), val >>> 0);
      },
      __wbindgen_debug_string: function () {},
      __wbindgen_throw: function (index, offset) {
        throw new Error(decodeSub(index, offset));
      },
      __wbindgen_memory: function () {
        return addToStack(wasm.memory);
      },
      __wbindgen_closure_wrapper117: function (Qn, QT) {
        return addToStack(args(Qn, QT, 2, export3));
      },
      __wbindgen_closure_wrapper119: function (Qn, QT) {
        return addToStack(args(Qn, QT, 2, export4));
      },
      __wbindgen_closure_wrapper121: function (Qn, QT) {
        return addToStack(args(Qn, QT, 2, export5));
      },
      __wbindgen_closure_wrapper123: function (Qn, QT) {
        let test = addToStack(args(Qn, QT, 9, export4));
        return test;
      },
    },
  };
  return wasmObj;
}

function assignWasm(resp) {
  wasm = resp.exports;
  (dataView = null), (memoryBuff = null), wasm;
}

function QZ(QP) {
  let Qn;
  return (
    (Qn = initWasm()),
    QP instanceof WebAssembly.Module || (QP = new WebAssembly.Module(QP)),
    assignWasm(new WebAssembly.Instance(QP, Qn))
  );
}

async function loadWasm(url) {
  let mod, buffer;
  return (
    (mod = initWasm()),
    ({
      instance: url,
      module: mod,
      bytes: buffer,
    } = ((url = fetch(url)), void 0, await QN(await url, mod))),
    assignWasm(url),
    buffer
  );
}

const grootLoader = {
  groot: function () {
    wasm.groot();
  },
};

let wasmLoader = Object.assign(loadWasm, { initSync: QZ }, grootLoader);

const V = async (url) => {
  let Q0 = await wasmLoader(url);
  fake_window.bytes = Q0;
  try {
    wasmLoader.groot();
  } catch (error) {
    console.error("error: ", error);
  }
  fake_window.jwt_plugin(Q0);
  return fake_window.navigate();
};

const getMeta = async (url) => {
  let resp = await fetch(url, {
    headers: {
      UserAgent: user_agent,
      Referrer: referrer,
    },
  });
  let txt = await resp.text();
  let regx = /name="j_crt" content="[A-Za-z0-9]*/g;
  let match = txt.match(regx)[0];
  let content = match.slice(match.lastIndexOf('"') + 1);
  meta.content = content + "==";
};

const i = (a, P) => {
  try {
    for (let Q0 = 0; Q0 < a.length; Q0++) {
      a[Q0] = a[Q0] ^ P[Q0 % P.length];
    }
  } catch (Q1) {
    return null;
  }
};

const M = (a, P) => {
  try {
    var Q0 = cryptoJs.AES.decrypt(a, P);
    return JSON.parse(Q0.toString(cryptoJs.enc.Utf8));
  } catch (Q1) {
    var Q0 = cryptoJs.AES.decrypt(a, P);
  }
  return [];
};

function z(a) {
  return [
    (a & 4278190080) >> 24,
    (a & 16711680) >> 16,
    (a & 65280) >> 8,
    a & 255,
  ];
}

const decryptSource = async (embed_url) => {
  referrer = embed_url.includes("mega")
    ? `https://${v1_base_url}`
    : new URL(embed_url).origin;
  let regx = /([A-Z])\w+/;
  let xrax = embed_url.split("/").pop().split("?").shift();
  regx = /https:\/\/[a-zA-Z0-9.]*/;
  let base_url = embed_url.match(regx)[0];
  nodeList.image.src = base_url + "/images/image.png?v=0.0.9";
  let data = new Uint8ClampedArray((await pixels(nodeList.image.src)).data);
  image_data.data = data;
  let test = embed_url.split("/");

  let browser_version = 1676800512;
  canvas.baseUrl = base_url;
  fake_window.origin = base_url;
  fake_window.location.origin = base_url;
  fake_window.location.href = embed_url;
  fake_window.xrax = xrax;
  fake_window.G = xrax;

  await getMeta(embed_url);

  let Q5 = await V(base_url + "/images/loading.png?v=0.0.9");

  let getSourcesUrl = "";

  if (base_url.includes("mega")) {
    getSourcesUrl =
      base_url +
      "/" +
      test[3] +
      "/ajax/" +
      test[4] +
      "/getSources?id=" +
      fake_window.pid +
      "&v=" +
      fake_window.localStorage.kversion +
      "&h=" +
      fake_window.localStorage.kid +
      "&b=" +
      browser_version;
  } else {
    getSourcesUrl =
      base_url +
      "/ajax/" +
      test[3] +
      "/" +
      test[4] +
      "/getSources?id=" +
      fake_window.pid +
      "&v=" +
      fake_window.localStorage.kversion +
      "&h=" +
      fake_window.localStorage.kid +
      "&b=" +
      browser_version;
  }

  let { data: resp } = await axios.get(getSourcesUrl, {
    headers: {
      "User-Agent": user_agent,
      Referrer: embed_url + "&autoPlay=1&oa=0&asi=1",
      "Accept-Language": "en,bn;q=0.9,en-US;q=0.8",
      "sec-ch-ua":
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Site": "same-origin",
      "X-Requested-With": "XMLHttpRequest",
      "Sec-Fetch-Mode": "cors",
    },
  });

  let Q3 = fake_window.localStorage.kversion;
  let Q1 = z(Q3);
  Q5 = new Uint8Array(Q5);
  let Q8 = resp.t != 0 ? (i(Q5, Q1), Q5) : ((Q8 = resp.k), i(Q8, Q1), Q8);
  let str = btoa(String.fromCharCode.apply(null, new Uint8Array(Q8)));
  var decryptedSource = M(resp.sources, str);
  resp.sources = decryptedSource;
  return resp;
};

export default async function decryptMegacloud(id, name, type) {
  try {
    const { data: sourcesData } = await axios.get(
      `https://${v1_base_url}/ajax/v2/episode/sources?id=${id}`
    );
    const source = await decryptSource(sourcesData.link);
    return {
      id: id,
      type: type,
      link: source.sources[0],
      tracks: source.tracks,
      intro: source.intro,
      outro: source.outro,
      server: name,
      iframe: sourcesData.link,
    };
  } catch (error) {
    console.error("Error during decryption:", error);
  }
}
