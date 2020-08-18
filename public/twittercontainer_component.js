'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ultwitter = function (_React$Component) {
	_inherits(Ultwitter, _React$Component);

	function Ultwitter(props) {
		_classCallCheck(this, Ultwitter);

		var _this = _possibleConstructorReturn(this, (Ultwitter.__proto__ || Object.getPrototypeOf(Ultwitter)).call(this, props));

		_this.state = {
			twitData: [],
			value: "....",
			activeCountry: "US"

		};

		_this.handleSubmit = _this.handleSubmit.bind(_this);
		_this.handlePost = _this.handlePost.bind(_this);

		return _this;
	}

	_createClass(Ultwitter, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var _this2 = this;

			fetch("OnlyCountries.json").then(function (result) {
				result.json().then(function (data) {
					data['onAutocomplete'] = _this2.handlePost;
					//document.getElementById
					var elems = document.getElementById('twitter-autocomplete');
					var instances = M.Autocomplete.init(elems, data);
				});
			});

			fetch('/defaultTwitter').then(function (response) {
				return response.json();
			}).then(function (data) {
				return _this2.setState(function (state, props) {
					return {
						twitData: data.twitterData,
						activeCountry: data.activeCountry
					};
				});
			});
		}
	}, {
		key: "handlePost",
		value: function handlePost(state) {
			var _this3 = this;

			fetch('/searchTwitter', {
				method: 'POST', // or 'PUT'
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ country: state })
			}).then(function (response) {
				return response.json();
			}).then(function (data) {
				_this3.setState(function (state, props) {
					return {
						twitData: data.twitterData,
						activeCountry: data.activeCountry
					};
				});
			}).catch(function (error) {
				console.error('Error:', error);
			});
		}
	}, {
		key: "handleSubmit",
		value: function handleSubmit(event) {
			event.preventDefault();
		}
	}, {
		key: "render",
		value: function render() {

			return React.createElement(
				"div",
				{ className: "col s12" },
				React.createElement(
					"form",
					{ onSubmit: this.handleSubmit, autoComplete: "off" },
					React.createElement(
						"div",
						{ className: "input-field" },
						React.createElement(
							"i",
							{ className: "material-icons prefix" },
							"search"
						),
						React.createElement("input", { id: "twitter-autocomplete", type: "text", className: "autocomplete", name: "country",
							required: true })
					)
				),
				React.createElement(
					"h4",
					{ className: "center" },
					" Tweets in ",
					this.state.activeCountry,
					" "
				),
				React.createElement(
					"ul",
					{ className: "collection with-header", id: "scrollcontainer" },
					React.createElement(
						"li",
						{ className: "collection-header" },
						this.state.twitData.map(function (item, index) {
							return React.createElement(
								"div",
								{ className: "collection-item", key: index },
								React.createElement(
									"div",
									null,
									React.createElement(
										"h5",
										null,
										item.title,
										" "
									)
								),
								React.createElement(
									"div",
									null,
									React.createElement(
										"i",
										{ className: "tiny material-icons prefix" },
										"send"
									),
									'    ' + item.hits,
									React.createElement(
										"a",
										{ href: item.url, className: "secondary-content", target: "blank" },
										React.createElement(
											"i",
											{ className: "small material-icons" },
											" insert_link "
										)
									)
								)
							);
						})
					)
				)
			);
		}
	}]);

	return Ultwitter;
}(React.Component);

ReactDOM.render(React.createElement(Ultwitter, null), document.getElementById('twittercontainer'));