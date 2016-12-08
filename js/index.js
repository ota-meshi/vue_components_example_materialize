
(function() {
	'use strict';


	/**
	 * アプリケーション本体
	 */
	window.app = new Vue({
		el: '#main',
		data: {
			inputValue1: '',
			inputValue2: '',
			inputValue3: '1234',
			inputValue4: '',
			inputValue5: '読み取り専用',
			inputValue6: '',
			inputValue7: '',

			datepickerValue1: undefined,
			datepickerValue2: null,
			datepickerValue3: null,
			datepickerValue4: undefined,

			selectValue1: '1',
			selectValue2: '',
			selectValue3: 3,
			selectValue4: '4',

			collectionItems1: [
				'item1',
				'item2',
				'item3',
			],

		},
		components: {
			collectionItem: {
				// script templateも可 `template: '#collectionitem-template',` など
				template: '<div>{{ item }}<a href="#!" class="secondary-content"><i class="material-icons" v-on:click="onClick" >send</i></a></div>',
				props: {
					item: String
				},
				methods: {
					onClick: function() {
						alert('click arrow!!');
					},
				},
			},
		},
		mounted: function() {
		},
		watch: {
		},
		computed: {
		},
		methods: {
			onButtonClick: function() {
				alert('click!!');
			},
			onClickItem: function(item) {
				alert('click!!' + item);
			},
			validate: function(val, input) {
				input.setInvalid('エラーメッセージ');
			},
		},
	});
	
})();