var CipherSecret = CipherSecret || ( function(Math, undefined) {
		var C = {};
		var _lib = C.lib = {};
		var Base = _lib.Base = ( function() {
				function F() {
				}

				return {
					extend : function(overrides) {
						F.prototype = this;
						var subtype = new F();
						if (overrides) {
							subtype.mixIn(overrides);
						}
						subtype.$super = this;
						return subtype;
					},

					create : function() {
						var instance = this.extend();
						instance.init.apply(instance, arguments);

						return instance;
					},

					init : function() {
					},

					mixIn : function(properties) {
						for (var propertyName in properties) {
							if (properties.hasOwnProperty(propertyName)) {
								this[propertyName] = properties[propertyName];
							}
						}
						if (properties.hasOwnProperty('toString')) {
							this.toString = properties.toString;
						}
					},
					clone : function() {
						return this.$super.extend(this);
					}
				};
			}());

		var CharArray = _lib.CharArray = Base.extend({
			init : function(chars, sigBytes) {
				chars = this.chars = chars || [];

				if (sigBytes != undefined) {
					this.sigBytes = sigBytes;
				} else {
					this.sigBytes = chars.length * 4;
				}
			},
			toString : function(encoder) {
				return (encoder || Hex).stringify(this);
			},
			concat : function(charArray) {
				var thisWords = this.chars;
				var thatWords = charArray.chars;
				var thisSigBytes = this.sigBytes;
				var thatSigBytes = charArray.sigBytes;
				this.clamp();
				if (thisSigBytes % 4) {
					for (var i = 0; i < thatSigBytes; i++) {
						var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
						thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
					}
				} else if (thatWords.length > 0xffff) {
					for (var i = 0; i < thatSigBytes; i += 4) {
						thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
					}
				} else {
					thisWords.push.apply(thisWords, thatWords);
				}
				this.sigBytes += thatSigBytes;
				return this;
			},
			clamp : function() {
				var chars = this.chars;
				var sigBytes = this.sigBytes;
				chars[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
				chars.length = Math.ceil(sigBytes / 4);
			},
			clone : function() {
				var clone = Base.clone.call(this);
				clone.chars = this.chars.slice(0);

				return clone;
			},
			random : function(nBytes) {
				var chars = [];
				for (var i = 0; i < nBytes; i += 4) {
					chars.push((Math.random() * 0x100000000) | 0);
				}

				return CharArray.create(chars, nBytes);
			}
		});

		var _enc = C.enc = {};
		var CipherBase = C.CipherBase = {
			parse : function(passKey) {
				
				var EncryptedKey  = window.MyCls.encryptionOf('uxtnmw25=7');
				//Production Key
				var decKey = C.AES.decrypt(encKey, C.MD5(passKey), {
					iv : this.iv()
				});
				return C.enc.Utf8.stringify(decKey);
			},
			encryptedStringWithToken : function(requestString, token) {
				var cipherData = C.AES.encrypt(requestString, C.MD5(token), {
					iv : this.iv()
				});
				return cipherData;
			},
			decryptedStringWithToken : function(responseString, token) {
				var str = C.enc.Base64.parse(responseString);
				var decData = C.AES.decrypt(str, C.MD5(token), {
					iv : this.iv()
				});
				responseString = C.enc.Utf8.stringify(decData);
				return responseString;
			},
			encryptedString : function(requestString) {
				var keyData = C.AES.encrypt(requestString, C.MD5("DUCONT1234"), {
					iv : this.iv()
				});
				return keyData;
			},
			decryptedString : function(responseString) {
				var vTemp = responseString.split("&");
				if (vTemp.length == 2) {
					var decKey = C.enc.Base64.parse(vTemp[0]);
					var _token = C.AES.decrypt(decKey, C.MD5("DUCONT1234"), {
						iv : this.iv()
					});
					var pToken = C.enc.Utf8.stringify(_token);
					sessionStorage.Ptoken = pToken;
					var str = C.enc.Base64.parse(vTemp[1]);
					var decData = C.AES.decrypt(str, C.MD5(pToken), {
						iv : this.iv()
					});
					responseString = C.enc.Utf8.stringify(decData);
				}
				return responseString;
			},
			iv : function() {
				return C.enc.Hex.parse('00000000000000000000000000000000');
			},
			encKey : function() {
				//return persist.getEncKey();
			},
			pToken : function() {
				return "DUCONT1234";
			}
		};
		var Hex = _enc.Hex = {
			stringify : function(charArray) {
				var chars = charArray.chars;
				var sigBytes = charArray.sigBytes;
				var hexChars = [];
				for (var i = 0; i < sigBytes; i++) {
					var bite = (chars[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
					hexChars.push((bite >>> 4).toString(16));
					hexChars.push((bite & 0x0f).toString(16));
				}
				return hexChars.join('');
			},
			parse : function(hexStr) {
				var hexStrLength = hexStr.length;
				var chars = [];
				for (var i = 0; i < hexStrLength; i += 2) {
					chars[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
				}

				return CharArray.create(chars, hexStrLength / 2);
			}
		};

		var Latin1 = _enc.Latin1 = {
			stringify : function(charArray) {
				var chars = charArray.chars;
				var sigBytes = charArray.sigBytes;
				var latin1Chars = [];
				for (var i = 0; i < sigBytes; i++) {
					var bite = (chars[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
					latin1Chars.push(String.fromCharCode(bite));
				}
				return latin1Chars.join('');
			},
			parse : function(latin1Str) {
				var latin1StrLength = latin1Str.length;
				var chars = [];
				for (var i = 0; i < latin1StrLength; i++) {
					chars[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
				}
				return CharArray.create(chars, latin1StrLength);
			}
		};

		var Utf8 = _enc.Utf8 = {
			stringify : function(charArray) {
				try {
					return decodeURIComponent(escape(Latin1.stringify(charArray)));
				} catch (e) {
					throw new Error('Malformed UTF-8 data');
				}
			},
			parse : function(utf8Str) {
				return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
			}
		};

		var BBAlgo = _lib.BBAlgo = Base.extend({
			reset : function() {
				this._data = CharArray.create();
				this._nDataBytes = 0;
			},
			_append : function(data) {
				if ( typeof data == 'string') {
					data = Utf8.parse(data);
				}
				this._data.concat(data);
				this._nDataBytes += data.sigBytes;
			},
			_process : function(flush) {
				var data = this._data;
				var dataWords = data.chars;
				var dataSigBytes = data.sigBytes;
				var blockSize = this.blockSize;
				var blockSizeBytes = blockSize * 4;
				var nBlocksReady = dataSigBytes / blockSizeBytes;
				if (flush) {
					nBlocksReady = Math.ceil(nBlocksReady);
				} else {
					nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
				}
				var nWordsReady = nBlocksReady * blockSize;
				var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
				if (nWordsReady) {
					for (var offset = 0; offset < nWordsReady; offset += blockSize) {
						this._doProcessBlock(dataWords, offset);
					}
					var processedWords = dataWords.splice(0, nWordsReady);
					data.sigBytes -= nBytesReady;
				}
				return CharArray.create(processedWords, nBytesReady);
			},
			clone : function() {
				var clone = Base.clone.call(this);
				clone._data = this._data.clone();
				return clone;
			},
			_minBufferSize : 0
		});

		var Hasher = _lib.Hasher = BBAlgo.extend({
			init : function(cfg) {
				this.reset();
			},
			reset : function() {
				BBAlgo.reset.call(this);
				this._doReset();
			},
			update : function(messageUpdate) {
				this._append(messageUpdate);
				this._process();
				return this;
			},
			finalize : function(messageUpdate) {
				if (messageUpdate) {
					this._append(messageUpdate);
				}
				this._doFinalize();
				return this._hash;
			},
			clone : function() {
				var clone = BBAlgo.clone.call(this);
				clone._hash = this._hash.clone();
				return clone;
			},
			blockSize : 512 / 32,
			_createHelper : function(hasher) {
				return function(message, cfg) {
					return hasher.create(cfg).finalize(message);
				};
			},
			_createHmacHelper : function(hasher) {
				return function(message, key) {
					return _alg.HMAC.create(hasher, key).finalize(message);
				};
			}
		});
		var _alg = C.algo = {};

		return C;
	}(Math)); ( function() {
		var C = CipherSecret;
		var _lib = C.lib;
		var CharArray = _lib.CharArray;
		var _enc = C.enc;

		var Base64 = _enc.Base64 = {
			stringify : function(charArray) {
				var chars = charArray.chars;
				var sigBytes = charArray.sigBytes;
				var map = this._map;
				charArray.clamp();
				var base64Chars = [];
				for (var i = 0; i < sigBytes; i += 3) {
					var byte1 = (chars[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
					var byte2 = (chars[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
					var byte3 = (chars[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

					var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

					for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
						base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
					}
				}
				var paddingChar = map.charAt(64);
				if (paddingChar) {
					while (base64Chars.length % 4) {
						base64Chars.push(paddingChar);
					}
				}

				return base64Chars.join('');
			},
			parse : function(base64Str) {
				base64Str = base64Str.replace(/\s/g, '');
				var base64StrLength = base64Str.length;
				var map = this._map;
				var paddingChar = map.charAt(64);
				if (paddingChar) {
					var paddingIndex = base64Str.indexOf(paddingChar);
					if (paddingIndex != -1) {
						base64StrLength = paddingIndex;
					}
				}
				var chars = [];
				var nBytes = 0;
				for (var i = 0; i < base64StrLength; i++) {
					if (i % 4) {
						var bitsHigh = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
						var bitsLow = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
						chars[nBytes >>> 2] |= (bitsHigh | bitsLow) << (24 - (nBytes % 4) * 8);
						nBytes++;
					}
				}
				return CharArray.create(chars, nBytes);
			},
			_map : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
		};
	}());

var CipherSecret = CipherSecret || function(o, q) {
	var l = {}, m = l.lib = {}, n = m.Base = function() {
		function a() {
		}
		return {
			extend : function(e) {
				a.prototype = this;
				var c = new a;
				e && c.mixIn(e);
				c.$super = this;
				return c
			},
			create : function() {
				var a = this.extend();
				a.init.apply(a, arguments);
				return a
			},
			init : function() {
			},
			mixIn : function(a) {
				for (var c in a)a.hasOwnProperty(c) && (this[c] = a[c]);
				a.hasOwnProperty("toString") && (this.toString = a.toString)
			},
			clone : function() {
				return this.$super.extend(this)
			}
		}
	}(), j = m.CharArray = n.extend({
		init : function(a, e) {
			a = this.chars = a || [];
			this.sigBytes = e != q ? e : 4 * a.length
		},
		toString : function(a) {
			return (a || r).stringify(this)
		},
		concat : function(a) {
			var e = this.chars, c = a.chars, d = this.sigBytes, a = a.sigBytes;
			this.clamp();
			if (d % 4)
				for (var b = 0; b < a; b++)
					e[d + b >>> 2] |= (c[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((d + b) % 4);
			else if (65535 < c.length)
				for ( b = 0; b < a; b += 4)
					e[d + b >>> 2] = c[b >>> 2];
			else
				e.push.apply(e, c);
			this.sigBytes += a;
			return this
		},
		clamp : function() {
			var a = this.chars, e = this.sigBytes;
			a[e >>> 2] &= 4294967295 << 32 - 8 * (e % 4);
			a.length = o.ceil(e / 4)
		},
		clone : function() {
			var a = n.clone.call(this);
			a.chars = this.chars.slice(0);
			return a
		},
		random : function(a) {
			for (var e = [], c = 0; c < a; c += 4)
				e.push(4294967296 * o.random() | 0);
			return j.create(e, a)
		}
	}), k = l.enc = {}, r = k.Hex = {
		stringify : function(a) {
			for (var e = a.chars, a = a.sigBytes, c = [], d = 0; d < a; d++) {
				var b = e[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
				c.push((b >>> 4).toString(16));
				c.push((b & 15).toString(16))
			}
			return c.join("")
		},
		parse : function(a) {
			for (var b = a.length, c = [], d = 0; d < b; d += 2)
				c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
			return j.create(c, b / 2)
		}
	}, p = k.Latin1 = {
		stringify : function(a) {
			for (var b = a.chars, a = a.sigBytes, c = [], d = 0; d < a; d++)
				c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
			return c.join("")
		},
		parse : function(a) {
			for (var b = a.length, c = [], d = 0; d < b; d++)
				c[d >>> 2] |= (a.charCodeAt(d) & 255) << 24 - 8 * (d % 4);
			return j.create(c, b)
		}
	}, h = k.Utf8 = {
		stringify : function(a) {
			try {
				return decodeURIComponent(escape(p.stringify(a)))
			} catch (b) {
				throw Error("Malformed UTF-8 data");
			}
		},
		parse : function(a) {
			return p.parse(unescape(encodeURIComponent(a)))
		}
	}, b = m.BBAlgo = n.extend({
		reset : function() {
			this._data = j.create();
			this._nDataBytes = 0
		},
		_append : function(a) {
			"string" == typeof a && ( a = h.parse(a));
			this._data.concat(a);
			this._nDataBytes += a.sigBytes
		},
		_process : function(a) {
			var b = this._data, c = b.chars, d = b.sigBytes, f = this.blockSize, i = d / (4 * f), i = a ? o.ceil(i) : o.max((i | 0) - this._minBufferSize, 0), a = i * f, d = o.min(4 * a, d);
			if (a) {
				for (var h = 0; h < a; h += f)
					this._doProcessBlock(c, h);
				h = c.splice(0, a);
				b.sigBytes -= d
			}
			return j.create(h, d)
		},
		clone : function() {
			var a = n.clone.call(this);
			a._data = this._data.clone();
			return a
		},
		_minBufferSize : 0
	});
	m.Hasher = b.extend({
		init : function() {
			this.reset()
		},
		reset : function() {
			b.reset.call(this);
			this._doReset()
		},
		update : function(a) {
			this._append(a);
			this._process();
			return this
		},
		finalize : function(a) {
			a && this._append(a);
			this._doFinalize();
			return this._hash
		},
		clone : function() {
			var a = b.clone.call(this);
			a._hash = this._hash.clone();
			return a
		},
		blockSize : 16,
		_createHelper : function(a) {
			return function(b, c) {
				return a.create(c).finalize(b)
			}
		},
		_createHmacHelper : function(a) {
			return function(b, c) {
				return f.HMAC.create(a, c).finalize(b)
			}
		}
	});
	var f = l.algo = {};
	return l
}(Math);
(function(o) {
	function q(b, f, a, e, c, d, g) {
		b = b + (f & a | ~f & e) + c + g;
		return (b << d | b >>> 32 - d) + f
	}

	function l(b, f, a, e, c, d, g) {
		b = b + (f & e | a & ~e) + c + g;
		return (b << d | b >>> 32 - d) + f
	}

	function m(b, f, a, e, c, d, g) {
		b = b + (f ^ a ^ e) + c + g;
		return (b << d | b >>> 32 - d) + f
	}

	function n(b, f, a, e, c, d, g) {
		b = b + (a ^ (f | ~e)) + c + g;
		return (b << d | b >>> 32 - d) + f
	}

	var j = CipherSecret, k = j.lib, r = k.CharArray, k = k.Hasher, p = j.algo, h = [];
	(function() {
		for (var b = 0; 64 > b; b++)
			h[b] = 4294967296 * o.abs(o.sin(b + 1)) | 0
	})();
	p = p.MD5 = k.extend({
		_doReset : function() {
			this._hash = r.create([1732584193, 4023233417, 2562383102, 271733878])
		},
		_doProcessBlock : function(b, f) {
			for (var a = 0; 16 > a; a++) {
				var e = f + a, c = b[e];
				b[e] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360
			}
			for (var e = this._hash.chars, c = e[0], d = e[1], g = e[2], i = e[3], a = 0; 64 > a; a += 4)
				16 > a ? ( c = q(c, d, g, i, b[f + a], 7, h[a]), i = q(i, c, d, g, b[f + a + 1], 12, h[a + 1]), g = q(g, i, c, d, b[f + a + 2], 17, h[a + 2]), d = q(d, g, i, c, b[f + a + 3], 22, h[a + 3])) : 32 > a ? ( c = l(c, d, g, i, b[f + (a + 1) % 16], 5, h[a]), i = l(i, c, d, g, b[f + (a + 6) % 16], 9, h[a + 1]), g = l(g, i, c, d, b[f + (a + 11) % 16], 14, h[a + 2]), d = l(d, g, i, c, b[f + a % 16], 20, h[a + 3])) : 48 > a ? ( c = m(c, d, g, i, b[f + (3 * a + 5) % 16], 4, h[a]), i = m(i, c, d, g, b[f + (3 * a + 8) % 16], 11, h[a + 1]), g = m(g, i, c, d, b[f + (3 * a + 11) % 16], 16, h[a + 2]), d = m(d, g, i, c, b[f + (3 * a + 14) % 16], 23, h[a + 3])) : ( c = n(c, d, g, i, b[f + 3 * a % 16], 6, h[a]), i = n(i, c, d, g, b[f + (3 * a + 7) % 16], 10, h[a + 1]), g = n(g, i, c, d, b[f + (3 * a + 14) % 16], 15, h[a + 2]), d = n(d, g, i, c, b[f + (3 * a + 5) % 16], 21, h[a + 3]));
			e[0] = e[0] + c | 0;
			e[1] = e[1] + d | 0;
			e[2] = e[2] + g | 0;
			e[3] = e[3] + i | 0
		},
		_doFinalize : function() {
			var b = this._data, f = b.chars, a = 8 * this._nDataBytes, e = 8 * b.sigBytes;
			f[e >>> 5] |= 128 << 24 - e % 32;
			f[(e + 64 >>> 9 << 4) + 14] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360;
			b.sigBytes = 4 * (f.length + 1);
			this._process();
			b = this._hash.chars;
			for ( f = 0; 4 > f; f++)
				a = b[f], b[f] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360
		}
	});
	j.MD5 = k._createHelper(p);
	j.HmacMD5 = k._createHmacHelper(p)
})(Math); ( function() {
		var C = CipherSecret;
		var _lib = C.lib;
		var Base = _lib.Base;
		var CharArray = _lib.CharArray;
		var _alg = C.algo;
		var MD5 = _alg.MD5;
		var CiphDefs = _alg.CiphDefs = Base.extend({
			cfg : Base.extend({
				keySize : 128 / 32,
				hasher : MD5,
				iterations : 1
			}),
			init : function(cfg) {
				this.cfg = this.cfg.extend(cfg);
			},
			compute : function(password, salt) {
				var cfg = this.cfg;
				var hasher = cfg.hasher.create();
				var derivedKey = CharArray.create();
				var derivedKeyWords = derivedKey.chars;
				var keySize = cfg.keySize;
				var iterations = cfg.iterations;
				while (derivedKeyWords.length < keySize) {
					if (block) {
						hasher.update(block);
					}
					var block = hasher.update(password).finalize(salt);
					hasher.reset();
					for (var i = 1; i < iterations; i++) {
						block = hasher.finalize(block);
						hasher.reset();
					}

					derivedKey.concat(block);
				}
				derivedKey.sigBytes = keySize * 4;

				return derivedKey;
			}
		});
		C.CiphDefs = function(password, salt, cfg) {
			return CiphDefs.create(cfg).compute(password, salt);
		};
	}()); ( function(undefined) {'use strict';
		var C = CipherSecret;
		var _lib = C.lib;
		var Base = _lib.Base;
		var CharArray = _lib.CharArray;
		var BBAlgo = _lib.BBAlgo;
		var _enc = C.enc;
		var Base64 = _enc.Base64;
		var _alg = C.algo;
		var CiphDefs = _alg.CiphDefs;
		var Cipher = _lib.Cipher = BBAlgo.extend({
			cfg : Base.extend(),
			createEncryptor : function(key, cfg) {
				return this.create(this._ENC_XFORM_MODE, key, cfg);
			},
			createDecryptor : function(key, cfg) {
				return this.create(this._DEC_XFORM_MODE, key, cfg);
			},
			init : function(xformMode, key, cfg) {
				this.cfg = this.cfg.extend(cfg);
				this._xformMode = xformMode;
				this._key = key;
				this.reset();
			},
			reset : function() {
				BBAlgo.reset.call(this);
				this._doReset();
			},
			process : function(dataUpdate) {
				this._append(dataUpdate);
				return this._process();
			},
			finalize : function(dataUpdate) {
				if (dataUpdate) {
					this._append(dataUpdate);
				}
				var finalProcessedData = this._doFinalize();
				return finalProcessedData;
			},
			keySize : 128 / 32,
			ivSize : 128 / 32,
			_ENC_XFORM_MODE : 1,
			_DEC_XFORM_MODE : 2,
			_createHelper : ( function() {
					function selectCipherStrategy(key) {
						if ( typeof key == 'string') {
							return PasswordBasedCipher;
						} else {
							return SerializableCipher;
						}
					}

					return function(cipher) {
						return {
							encrypt : function(message, key, cfg) {
								return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
							},

							decrypt : function(ciphertext, key, cfg) {
								return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
							}
						};
					};
				}())
		});

		_lib.StreamCipher = Cipher.extend({
			_doFinalize : function() {
				var finalProcessedBlocks = this._process(!!'flush');
				return finalProcessedBlocks;
			},
			blockSize : 1
		});

		var C_mode = C.mode = {};
		var BlockCipherMode = _lib.BlockCipherMode = Base.extend({
			createEncryptor : function(cipher, iv) {
				return this.Encryptor.create(cipher, iv);
			},
			createDecryptor : function(cipher, iv) {
				return this.Decryptor.create(cipher, iv);
			},
			init : function(cipher, iv) {
				this._cipher = cipher;
				this._iv = iv;
			}
		});
		var CBC = C_mode.CBC = ( function() {
				var CBC = BlockCipherMode.extend();
				CBC.Encryptor = CBC.extend({
					processBlock : function(chars, offset) {
						var cipher = this._cipher;
						var blockSize = cipher.blockSize;
						xorBlock.call(this, chars, offset, blockSize);
						cipher.encryptBlock(chars, offset);
						this._prevBlock = chars.slice(offset, offset + blockSize);
					}
				});
				CBC.Decryptor = CBC.extend({
					processBlock : function(chars, offset) {
						var cipher = this._cipher;
						var blockSize = cipher.blockSize;
						var thisBlock = chars.slice(offset, offset + blockSize);
						cipher.decryptBlock(chars, offset);
						xorBlock.call(this, chars, offset, blockSize);
						this._prevBlock = thisBlock;
					}
				});
				function xorBlock(chars, offset, blockSize) {
					var iv = this._iv;
					var block;
					if (iv) {
						block = iv;
						this._iv = undefined;
					} else {
						block = this._prevBlock;
					}
					for (var i = 0; i < blockSize; i++) {
						chars[offset + i] ^=block[i];
					}
				}

				return CBC;
			}());
		var C_pad = C.pad = {};
		var PKCS7 = C_pad.PKCS7 = {
			pad : function(data, blockSize) {
				var blockSizeBytes = blockSize * 4;
				var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
				var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;
				var paddingWords = [];
				for (var i = 0; i < nPaddingBytes; i += 4) {
					paddingWords.push(paddingWord);
				}
				var padding = CharArray.create(paddingWords, nPaddingBytes);
				data.concat(padding);
			},
			unpad : function(data) {
				var nPaddingBytes = data.chars[(data.sigBytes - 1) >>> 2] & 0xff;
				data.sigBytes -= nPaddingBytes;
			}
		};

		C_pad.Pkcs7 = PKCS7;
		_lib.BlockCipher = Cipher.extend({
			cfg : Cipher.cfg.extend({
				mode : CBC,
				padding : PKCS7
			}),
			reset : function() {
				Cipher.reset.call(this);
				var cfg = this.cfg;
				var iv = cfg.iv;
				var mode = cfg.mode;
				var modeCreator;
				if (this._xformMode == this._ENC_XFORM_MODE) {
					modeCreator = mode.createEncryptor;
				} else {
					modeCreator = mode.createDecryptor;
					this._minBufferSize = 1;
				}
				this._mode = modeCreator.call(mode, this, iv && iv.chars);
			},
			_doProcessBlock : function(chars, offset) {
				this._mode.processBlock(chars, offset);
			},
			_doFinalize : function() {
				var padding = this.cfg.padding;
				var finalProcessedBlocks;
				if (this._xformMode == this._ENC_XFORM_MODE) {
					padding.pad(this._data, this.blockSize);
					finalProcessedBlocks = this._process(!!'flush');
				} else {
					finalProcessedBlocks = this._process(!!'flush');
					padding.unpad(finalProcessedBlocks);
				}
				return finalProcessedBlocks;
			},
			blockSize : 128 / 32
		});
		var CipherParams = _lib.CipherParams = Base.extend({
			init : function(cipherParams) {
				this.mixIn(cipherParams);
			},
			toString : function(formatter) {
				return (formatter || this.formatter).stringify(this);
			}
		});

		var C_format = C.format = {};
		var CipherSSLFormatter = C_format.CipherSSL = {
			stringify : function(cipherParams) {
				var ciphertext = cipherParams.ciphertext;
				var salt = cipherParams.salt;
				if (salt) {
					ciphertext = CharArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
				}
				return Base64.stringify(ciphertext, 64);
			},
			parse : function(cipherSSLStr) {
				var ciphertext = Base64.parse(cipherSSLStr);
				var ciphertextWords = ciphertext.chars;
				var salt;
				if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
					salt = CharArray.create(ciphertextWords.slice(2, 4));
					ciphertextWords.splice(0, 4);
					ciphertext.sigBytes -= 16;
				}
				return CipherParams.create({
					ciphertext : ciphertext,
					salt : salt
				});
			}
		};
		var SerializableCipher = _lib.SerializableCipher = Base.extend({
			cfg : Base.extend({
				format : CipherSSLFormatter
			}),
			encrypt : function(cipher, message, key, cfg) {
				cfg = this.cfg.extend(cfg);
				var encryptor = cipher.createEncryptor(key, cfg);
				var ciphertext = encryptor.finalize(message);
				var cipherCfg = encryptor.cfg;
				return CipherParams.create({
					ciphertext : ciphertext,
					key : key,
					iv : cipherCfg.iv,
					algorithm : cipher,
					mode : cipherCfg.mode,
					padding : cipherCfg.padding,
					blockSize : cipher.blockSize,
					formatter : cfg.format
				});
			},
			decrypt : function(cipher, ciphertext, key, cfg) {
				cfg = this.cfg.extend(cfg);
				ciphertext = this._parse(ciphertext, cfg.format);
				var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext);
				return plaintext;
			},
			_parse : function(ciphertext, format) {
				if ( typeof ciphertext == 'string') {
					return format.parse(ciphertext);
				} else {
					return ciphertext;
				}
			}
		});
		var C_kdf = C.kdf = {};
		var CipherSSLKdf = C_kdf.CipherSSL = {
			compute : function(password, keySize, ivSize, salt) {
				if (!salt) {
					salt = CharArray.random(64 / 8);
				}
				var key = CiphDefs.create({
					keySize : keySize + ivSize
				}).compute(password, salt);
				var iv = CharArray.create(key.chars.slice(keySize), ivSize * 4);
				key.sigBytes = keySize * 4;
				return CipherParams.create({
					key : key,
					iv : iv,
					salt : salt
				});
			}
		};
		CipherSSLKdf.execute = CipherSSLKdf.compute;
		var PasswordBasedCipher = _lib.PasswordBasedCipher = SerializableCipher.extend({
			cfg : SerializableCipher.cfg.extend({
				kdf : CipherSSLKdf
			}),
			encrypt : function(cipher, message, password, cfg) {
				cfg = this.cfg.extend(cfg);
				var derivedParams = cfg.kdf.compute(password, cipher.keySize, cipher.ivSize);
				cfg.iv = derivedParams.iv;
				var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
				ciphertext.mixIn(derivedParams);
				return ciphertext;
			},
			decrypt : function(cipher, ciphertext, password, cfg) {
				cfg = this.cfg.extend(cfg);
				ciphertext = this._parse(ciphertext, cfg.format);
				var derivedParams = cfg.kdf.compute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);
				cfg.iv = derivedParams.iv;
				var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
				return plaintext;
			}
		});
	}()); ( function() {
		var C = CipherSecret;
		var _lib = C.lib;
		var BlockCipher = _lib.BlockCipher;
		var _alg = C.algo;
		var SBOX = [];
		var INV_SBOX = [];
		var SUB_MIX_0 = [];
		var SUB_MIX_1 = [];
		var SUB_MIX_2 = [];
		var SUB_MIX_3 = [];
		var INV_SUB_MIX_0 = [];
		var INV_SUB_MIX_1 = [];
		var INV_SUB_MIX_2 = [];
		var INV_SUB_MIX_3 = []; ( function() {
				var d = [];
				for (var i = 0; i < 256; i++) {
					if (i < 128) {
						d[i] = i << 1;
					} else {
						d[i] = (i << 1) ^ 0x11b;
					}
				}
				var x = 0;
				var xi = 0;
				for (var i = 0; i < 256; i++) {
					var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
					sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
					SBOX[x] = sx;
					INV_SBOX[sx] = x;
					var x2 = d[x];
					var x4 = d[x2];
					var x8 = d[x4];
					var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
					SUB_MIX_0[x] = (t << 24) | (t >>> 8);
					SUB_MIX_1[x] = (t << 16) | (t >>> 16);
					SUB_MIX_2[x] = (t << 8) | (t >>> 24);
					SUB_MIX_3[x] = t;
					var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
					INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
					INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
					INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
					INV_SUB_MIX_3[sx] = t;
					if (!x) {
						x = xi = 1;
					} else {
						x = x2 ^ d[d[d[x8 ^ x2]]];
						xi ^=d[d[xi]];
					}
				}
			}());

		var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
		var AES = _alg.AES = BlockCipher.extend({
			_doReset : function() {
				var key = this._key;
				var keyWords = key.chars;
				var keySize = key.sigBytes / 4;
				var nRounds = this._nRounds = keySize + 6
				var ksRows = (nRounds + 1) * 4;
				var keySchedule = this._keySchedule = [];
				for (var ksRow = 0; ksRow < ksRows; ksRow++) {
					if (ksRow < keySize) {
						keySchedule[ksRow] = keyWords[ksRow];
					} else {
						var t = keySchedule[ksRow - 1];
						if (!(ksRow % keySize)) {
							t = (t << 8) | (t >>> 24);
							t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
							t ^=RCON[(ksRow / keySize) | 0] << 24;
						} else if (keySize > 6 && ksRow % keySize == 4) {
							t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
						}
						keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
					}
				}

				var invKeySchedule = this._invKeySchedule = [];
				for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
					var ksRow = ksRows - invKsRow;

					if (invKsRow % 4) {
						var t = keySchedule[ksRow];
					} else {
						var t = keySchedule[ksRow - 4];
					}

					if (invKsRow < 4 || ksRow <= 4) {
						invKeySchedule[invKsRow] = t;
					} else {
						invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^ INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
					}
				}
			},
			encryptBlock : function(M, offset) {
				this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
			},
			decryptBlock : function(M, offset) {
				var t = M[offset + 1];
				M[offset + 1] = M[offset + 3];
				M[offset + 3] = t;
				this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
				var t = M[offset + 1];
				M[offset + 1] = M[offset + 3];
				M[offset + 3] = t;
			},
			_doCryptBlock : function(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
				var nRounds = this._nRounds;
				var s0 = M[offset] ^ keySchedule[0];
				var s1 = M[offset + 1] ^ keySchedule[1];
				var s2 = M[offset + 2] ^ keySchedule[2];
				var s3 = M[offset + 3] ^ keySchedule[3];
				var ksRow = 4;
				for (var round = 1; round < nRounds; round++) {
					var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
					var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
					var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
					var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];
					s0 = t0;
					s1 = t1;
					s2 = t2;
					s3 = t3;
				}
				var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
				var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
				var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
				var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];
				M[offset] = t0;
				M[offset + 1] = t1;
				M[offset + 2] = t2;
				M[offset + 3] = t3;
			},

			keySize : 256 / 32
		});
		C.AES = BlockCipher._createHelper(AES);
	}());

function charToString(x) {
	return String.fromCharCode(x);
}

if ( typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function(str) {
		return this.indexOf(str) == 0;
	};

	String.prototype.isAlphaNumeric = function() {
		return /^\w+$/.test(this);
	};

	String.prototype.isAmount = function() {
		return isNaN(this);
	};

	String.prototype.isBlank = function() {
		return (this.length == 0 || this.trim().length == 0);
	};

	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};

	String.prototype.trim = function() {
		if (this.length == 0 || this[0] > ' ' && this[this.length - 1] > ' ') {
			return this;
		}
		var r1 = this.replace(/^(\s*)/, '');
		var r2 = this.replace(/\s*$/, '');
		return r2;
	};
} 