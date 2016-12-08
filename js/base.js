(function() {
	'use strict';
	//http://qiita.com/coa00@github/items/679b0b5c7c468698d53f
	function getUniqueStr(myStrong) {
		var strong = 1000;
		if (myStrong) { strong = myStrong; }
		return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16);
	}
	var timezoneOffsetMs = new Date().getTimezoneOffset() * 60000;
	var localToUTC = function(date) {
		if (!date) {
			return date;
		}
		var utc = date.getTime() - timezoneOffsetMs;
		return new Date(utc);
	};
	var utcToLocal = function(utc) {
		if (!utc) {
			return utc;
		}
		var local = utc.getTime() + timezoneOffsetMs;
		return new Date(local);
	};
	var utcFormat = function(date, format) {
		if (!date) {
			return '';
		}
		if (isNaN(date)) {
			return '';
		}
		if (!format) {
			return date.toISOString();
		} else {
			//参考：http://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
			format = format.replace(/yyyy/g, date.getUTCFullYear());
			format = format.replace(/MM/g, ('0' + (date.getUTCMonth() + 1)).slice(-2));
			format = format.replace(/dd/g, ('0' + date.getUTCDate()).slice(-2));
			format = format.replace(/hh/g, ('0' + date.getUTCHours()).slice(-2));
			format = format.replace(/mm/g, ('0' + date.getUTCMinutes()).slice(-2));
			format = format.replace(/ss/g, ('0' + date.getUTCSeconds()).slice(-2));
			if (format.match(/S/g)) {
				var milliseconds = ('00' + date.getUTCMilliseconds()).slice(-3);
				var length = format.match(/S/g).length;
				for (var i = 0; i < length; i++) {
					format = format.replace(/S/, milliseconds.substring(i, i + 1));
				}
			}
			return format;
		}
	};
	var dateparse = function(str) {
		return utcToLocal(new Date(str));
	};
	var dateformat = function(date, format) {
		return utcFormat(localToUTC(date), format);
	};

	var isNumber = function(s) {
		if ('' === s) {
			return true;
		}
		return !isNaN(s - 0);
	};

	var numseparate = function(num) {
		if (isNumber(num)) {
			num = num + '';
			var spl = num.split('.');
			spl[0] = spl[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');

			return 1 === spl.length ? spl[0] : spl[0] + '.' + spl[1];
		} else {
			return num;
		}
	};
	var numunseparate = function(numstr) {
		if ('' === numstr) {
			return '';
		}
		var num = (numstr + '').trim().replace(/,/g, '') - 0;
		return isNaN(num) ? numstr : num;
	};

	var Button = Vue.extend({
		props: {
			id: String,
			href: String,
			icon: String,
			flat: Boolean,
			floating: Boolean,
			'class': String,
			disabled: Boolean,
			tabindex: {
				type: Number,
				default: 0,
			},
		},
		template: '<a ' +
                    ':id="id" ' +
                    ':class="classNames" ' +
                    ':href="href" ' +
                    'v-on:click="onClick" ' +
                    'v-on:keyup.enter="onClick"' +
                    ':tabindex="disabled ? -1 : tabindex"' +
                    ':disabled=" disabled ? \'disabled\' : null "' +
                    ' >' +
                    '<i v-if="icon" class="material-icons left">{{icon}}</i>' +
                    '<slot><!-- ラベル--></slot>' +
                '</a>',
		methods: {
			onClick: function(e) {
				if (this.$el.hasAttribute('disabled')) {
					return;
				}
				this.$emit('click', e);
			}
		},
		computed: {
			classNames: function() {
				var classes = {
					'waves-effect': true,
					'waves-light': !this.flat,
					'btn': !this.flat && !this.floating,
					'btn-flat': this.flat,
					'btn-floating': this.floating,
				};
				if (this.class) {
					classes[this.class] = true;
				}

				return classes;
			},
		},
	});
	var DropdownButton = Button.extend({
		props: {
			dropdownId: {
				type: String,
				default: function() {
					return getUniqueStr() + '-dropitems';
				},
			},
		},
		template: '<div>' +
					'<a ' +
						':id="id" ' +
						'ref="button" ' +
						':class="classNames" ' +
						':tabindex="disabled ? -1 : tabindex"' +
						':disabled=" disabled ? \'disabled\' : null "' +
						':data-activates="dropdownId" ' +
						' >' +
						'<i v-if="icon" class="material-icons left">{{icon}}</i>' +
						'<slot name="label" ><!-- ラベル--></slot>' +
					'</a>' +
					'<ul ref="dropdown" :id="dropdownId" class="dropdown-content" >' +
						'<slot ><!-- Dropdowns--></slot>' +
					'</ul>' +
				'</div>',
		mounted: function() {
			$(this.$refs.button).dropdown();
		},
		methods: {
			open: function() {
				$(this.$refs.button).dropdown('open');
			},
			close: function() {
				$(this.$refs.button).dropdown('close');
			},
		},
	});
	var DropItem = Vue.extend({
		props: {
			id: String,
			divider: Boolean,
			href: String,
		},
		template: '<li :id="id" :class="classNames">' +
					'<a ' +
						'v-if="!divider" ' +
						'ref="anchor" ' +
						':href="href" ' +
						'v-on:click="onClick"' +
						'>' +
						'<slot ><!-- ラベル--></slot>' +
					'</a>' +
				'</li>',
		methods: {
			onClick: function(e) {
				this.$emit('click', e);
			}
		},
		computed: {
			classNames: function() {
				return {
					divider: this.divider,
				};
			},
		},
	});

	var updateTextFieldsTimeoutId;
	var updateTextFields = function() {
		if (updateTextFieldsTimeoutId) {
			clearTimeout(updateTextFieldsTimeoutId);
		}
		updateTextFieldsTimeoutId = setTimeout(function() {
			Materialize.updateTextFields();
		}, 100);
	};
	var Input = Vue.extend({
		props: {
			id: String,
			value: {
				type: [String, Number],
				default: ''
			},
			label: String,
			icon: String,
			placeholder: String,
			required: Boolean,
			readonly: Boolean,
			type: {
				type: String,
				default: 'text',
			},
		},
		// https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events
		template: '<div class="input-field" >' +
					'<i v-if="icon" class="material-icons prefix">{{icon}}</i>' +
					'<input ' +
						':id="id" ' +
						'ref="input" ' +
						':type="type === \'number\' ? \'text\' : type" ' +
						':placeholder="placeholder" ' +
						':required="required ? \'true\' : null" ' +
						':aria-required="required ? \'true\' : null" ' +
						':readonly="readonly ? \'true\' : null" ' +
						':class="inputClassNames" ' +
						'v-on:input="updateValue($event.target.value)" ' +
						'v-on:blur="onBlur" ' +
						'v-on:focus="onFocus" ' +
						'/>' +
					'<label ref="label" :for="id" >{{label}}</label>' +
				'</div>',

		watch: {
			value: function(val, oldVal) {
				if (document.activeElement === this.$refs.input) {
					return;
				}
				this.$refs.input.value = this.valueToDisplay(val);
			},
		},
		methods: {
			updateValue: function(value) {
				this.$emit('input', this.inputToValue(value));
			},
			onBlur: function(e) {
				this.blurChangeInputValue(this.$refs.input);
				this.$emit('blur', e);
			},
			onFocus: function(e) {
				this.focusChangeInputValue(this.$refs.input);
				this.$emit('focus', e);
			},
			validate: function() {
				var value = this.inputToValue(this.$refs.input.value);

				if (this.required && (null === value || 'undefined' === typeof value || '' === value)) {
					this.setInvalid('empty');
					return false;
				}
				if ('number' === this.type && !isNumber(value)) {
					this.setInvalid('not a number');
					return false;
				}
				this.$refs.input.classList.remove('invalid');
				this.$emit('validate', value, this);
				return this.$refs.input.classList.contains('invalid');
			},
			setInvalid: function(msg) {
				if (msg) {
					this.$refs.label.setAttribute('data-error', msg);
					this.$refs.label.classList.add('active');
					this.$refs.input.classList.add('invalid');
				}
			},
			valueToDisplay: function(value) {
				if ('number' === this.type) {
					return numseparate(value);
				}
				return value;
			},
			inputToValue: function(value) {
				if ('number' === this.type) {
					return numunseparate(value);
				}
				return value;
			},
			blurChangeInputValue: function(input) {
				if ('number' === this.type) {
					var num = input.value.trim() - 0;
					if (!isNaN(num)) {
						input.value = numseparate(num);
					}
				}
			},
			focusChangeInputValue: function(input) {
				if ('number' === this.type) {
					input.value = this.inputToValue(input.value);
				}
			},
		},
		mounted: function() {
			this.$refs.input.value = this.valueToDisplay(this.value);
			updateTextFields();
			//materializeのvalidationに無理やり乗せる
			this.$refs.input['$ validate $'] = this.validate.bind(this);

			//なぜか再レンダリングされるので抑制（良い方法がわからない。1度再レンダリングさせると起きなくなったりするので、1回だけ再レンダリングさせる）
			setTimeout(function() {
				var val = this.value;
				this.$emit('input', val + '-');//適当な値に変更
				this.$emit('input', val);
			}.bind(this), 100);
		},
		computed: {
			inputClassNames: function() {
				return {
					'validate': true,
					'right-align': 'number' === this.type,
				};
			},
		},
	});

	$(document).ready(function() {
		//materializeのvalidationを無理やり拡張する黒魔術
		var origValidateField = window.validate_field;
		window.validate_field = function($obj) { //eslint-disable-line camelcase
			origValidateField($obj);

			if ($obj[0]['$ validate $']) {
				$obj[0]['$ validate $']();
			}
		};
	});

	var Datepicker = Input.extend({
		props: {
			value: {
				type: Date,
				default: function() {
					var d = new Date();
					return new Date(d.getFullYear(), d.getMonth(), d.getDate());
				},
			},
		},
		template: '<div class="input-field" >' +
					'<input ' +
						':id="id" ' +
						'ref="input" ' +
						'type="text" ' +
						':placeholder="placeholder" ' +
						':required="required ? \'true\' : null" ' +
						':aria-required="required ? \'true\' : null" ' +
						':readonly="readonly ? \'true\' : null" ' +
						':class="inputClassNames" ' +
						'v-on:input="updateValue($event.target.value)" ' +
						'v-on:blur="onBlur" ' +
						'v-on:focus="onFocus" ' +
						'/>' +
					'<label ref="label" :for="id" >{{label}}</label>' +
				'</div>',
		watch: {
			readonly: function(val) {
				var picker = $(this.$el).find('.datepicker').pickadate('picker');
				if (val) {
					picker.stop();
					this.$refs.input.setAttribute('readonly', true);
				} else {
					picker.start();
					this.$refs.input.removeAttribute('readonly', true);
				}
			},
		},
		methods: {
			valueToDisplay: function(value) {
				if (!value) {
					return '';
				}
				return dateformat(value, 'yyyy/MM/dd');
			},
			inputToValue: function(value) {
				if (!value) {
					return null;
				}
				return dateparse(value);
			},
			blurAdjustInput: function(input) {
				//nop
			},
			focusAdjustInput: function(input) {
				//nop
			},
		},
		mounted: function() {
			var picker = $(this.$el).find('.datepicker').pickadate({
				selectMonths: true, // Creates a dropdown to control month
				selectYears: 15 // Creates a dropdown of 15 years to control year
			}).pickadate('picker');
			picker.on('set', function(e) {
				var d = new Date(e.select);
				if (isNaN(d)) {
					d = null;
				}
				this.$refs.input.value = this.valueToDisplay(d);
				this.$emit('input', d);
			}.bind(this));
			this.$el.appendChild(picker.$root[0]);
			picker.set('select', this.value ? this.value.getTime() : new Date(NaN));

			if (this.readonly) {
				picker.stop();
				this.$refs.input.setAttribute('readonly', true);
			}
		},
		computed: {
			inputClassNames: function() {
				var classNames = Input.options.computed.inputClassNames.call(this);
				classNames.datepicker = true;
				return classNames;
			},
		},
	});

	var Select = Vue.extend({
		props: {
			id: String,
			value: {
				type: [String, Number],
				default: null,
			},
			label: String,
			required: Boolean,
			number: Boolean,
			disabled: Boolean,
		},
		template: '<div class="input-field">' +
				'	<select ' +
					':id="id" ' +
					'ref="select" ' +
					':required="required ? \'true\' : null" ' +
					':aria-required="required ? \'true\' : null" ' +
					':disabled="disabled ? \'true\' : null" ' +
					'class="validate" ' +
					'>' +
						'<slot />' +
					'</select>' +
					'<label ref="label" :for="id" >{{label}}</label>' +
				'</div>',
		watch: {
			value: function(newValue, oldValue) {
				var $sel = $(this.$refs.select);
				if ($sel.val() !== newValue) {
					$sel.val(newValue);
					this.materialSelect();
				}
			},
		},
		methods: {
			updateValue: function(value) {
				value = this.selectToValue(value);
				//v-modelが無いとき値が当たらないので設定
				this.$emit('input', value);
				this.validate();
			},
			validate: function() {
				var value = this.selectToValue($(this.$refs.select).val());
				if (this.required && !value) {
					if ($(this.$el).find('select option').length) {
						this.setInvalid('empty');
					} else {
						this.setInvalid('選択可能な値がありません');
					}
					this.reflectInvalid();
					return false;
				}
				this.$refs.select.classList.remove('invalid');
				this.$emit('validate', value, this);
				this.reflectInvalid();
				return this.$refs.select.classList.contains('invalid');
			},
			setInvalid: function(msg) {
				if (msg) {
					this.$refs.label.setAttribute('data-error', msg);
					this.$refs.select.classList.add('invalid');
				}
			},
			getDisplayValue: function() {
				var $sel = $(this.$el).find('select');
				if (-1 === $sel[0].selectedIndex) {
					$sel[0].selectedIndex = 0;
				}
				return $sel.val();
			},
			selectToValue: function(value) {
				if (this.number) {
					return !isNaN(value - 0) ? value - 0 : value;
				}
				return value;
			},
			reflectInvalid: function() {
				//http://stackoverflow.com/questions/34248898/how-to-validate-select-option-for-materialize-dropdown
				$(this.$el).find('.error_note').remove();
				if (this.$refs.select.classList.contains('invalid')) {
					var inputTarget = $(this.$el).find('input.select-dropdown');
					inputTarget.css({
						'border-color': '#EA454B',
						'box-shadow': '0 1px 0 0 #EA454B'
					});
					inputTarget.after(
						'<span class="error_note" style="color: #EA454B;font-size: 12px; position: absolute; top: 49px;">' +
						this.$refs.label.getAttribute('data-error') +
						'</span>'
					);
				}
			},
			materialSelect: function() {
				var $sel = $(this.$refs.select);
				$sel.material_select();
				var inputTarget = $(this.$el).find('input.select-dropdown');
				inputTarget[0]['$ validate $'] = this.validate.bind(this);
			},
		},
		mounted: function() {
			var $sel = $(this.$refs.select);
			$sel.val(this.value);
			//表示内容と違うものが選択されている
			if (this.value !== this.getDisplayValue()) {
				this.value = this.selectToValue(this.getDisplayValue());
			}
			this.materialSelect();

			$sel.on('change', function() {
				this.updateValue($(this.$refs.select).val());
			}.bind(this));

			
		},
		updated: function() {
			var $sel = $(this.$refs.select);
			$sel.val(this.value);
			if (this.value !== this.getDisplayValue()) {
				this.updateValue(this.getDisplayValue());
			}
			this.materialSelect();
			this.reflectInvalid();
		},
	});

	var Collection = Vue.extend({
		props: {
			items: Array,
			itemComponent: {
				type: Object,
				default: function() {
					return {
						template: '<span>{{ item }} </span>',
						props: {
							item: String,
						},
					};
				},
			},
		},
		//https://github.com/vuejs/vue/issues/2511
		template: '<ul :class="{collection:true, \'with-header\': !!$slots.header}">' +
					'<li v-if="$slots.header" class="collection-header">' +
						'<slot name="header"></slot>' +
					'</li>' +
					'<li class="collection-item" v-for="item in items" >' +
						'<component :is="itemComponent" :item="item"></component>' +
					'</li>' +
				'</ul>',
	});

	var Collection2 = Vue.extend({
		props: {
		},
		render: function(h) {
			var items = [];
			if (this.$slots.header) {
				items.push(this.$createElement('li', {
					class: {
						'collection-header': true,
					}
				}, this.$slots.header));
			}
			if (this.$slots.default) {
				this.$slots.default.forEach(function(slot) {
					if (!slot.tag && (!slot.text || !slot.text.trim())) {
						return;
					}
					//わたってきたslotをliタグで囲む
					items.push(this.$createElement('li', {
						class: {
							'collection-item': true,
						}
					}, [slot]));
				}.bind(this));
			}
			return this.$createElement('ul', {
				class: {
					collection: true,
					'with-header': !!this.$slots.header,
				}
			}, items);
		},
	});
	var Collection3 = Vue.extend({
		props: {
		},
		components: {
			renderItem: {
				props: {
					vnode: Object,
				},
				render: function() {
					return this.vnode;
				}
			}
		},
		template: '<ul :class="{collection:true, \'with-header\': !!$slots.header}">' +
					'<li v-if="$slots.header" class="collection-header">' +
						'<slot name="header"></slot>' +
					'</li>' +
					'<li class="collection-item" v-for="vnode in $slots.default"　v-if="vnode.tag || (vnode.text && vnode.text.trim())" >' +
						'<render-item :vnode="vnode" ></render-item>' +
					'</li>' +
				'</ul>',
	});

	Vue.component('m-button', Button);

	Vue.component('m-dropdown-button', DropdownButton);
	Vue.component('m-dropitem', DropItem);

	Vue.component('m-input', Input);
	Vue.component('m-datepicker', Datepicker);
	Vue.component('m-select', Select);
	
	Vue.component('m-collection', Collection);
	Vue.component('m-collection2', Collection2);
	Vue.component('m-collection3', Collection3);

	// 1234567 | num.separate -> '1,234,567'
	Vue.filter('num.separate', numseparate);
	// new Date(2000, 0, 1) | date.format('yyyy/MM/dd') -> '2000/01/01'
	Vue.filter('date.format', dateformat);
})();


