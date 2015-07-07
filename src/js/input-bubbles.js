(function() {

    function InputBubbles() {

        var _values = [];
        var _nodes = [];

        /**
         * Returns option
         * @param option Name of option
         */
        this.get = function(option) {
            if (typeof option !== 'string') {
                throw new Error('Invalid option!');
            }
            return this[option];
        };

        /**
         * Sets option
         * @param option Name of option
         * @param value value of option
         */
        this.set = function(option, value) {
            if (typeof option !== 'string') {
                throw new Error('Invalid option!');
            }
            this[option] = value;
        };

        /**
         * Subscribes to event
         * @param action Name of event
         * @param func Callback
         */
        this.on = function(action, func) {
            if (typeof action !== 'string' || typeof func !== 'function') {
                throw new Error('Invalid operation!');
            }
            this[action] = func;
        };

        /**
         * Triggers event
         * @param action Name of event
         * @param params Parameters
         */
        this.trigger = function(action) {
            if (typeof action !== 'string') {
                throw new Error('Invalid operation!');
            }
            if (!this[action]) {
                throw new Error('Action "' + action + '" was not defined!')
            }

            if (arguments.length > 1) {
                var args = ([]).slice.call(arguments);
                this[action].apply(this, args.splice(1, args.length));
            } else {
                this[action]();
            }
        };

        /**
         * Inserts bubble into element
         * @param params
         */
        this.addBubble = function(text) {
            var _text = (text ? text : this.innerElement.textContent).trim();
            if (!_text) {
                return;
            }

            var div = document.createElement('div');
            div.className = 'js-bubble-item ui-bubble';
            div.innerHTML = _makeBubble.call(this, _text);

            this.element.insertBefore(div, this.innerElement);

            _values.push(_text);
            _nodes.push(div);

            div.querySelector('.ui-bubble-remove').addEventListener('click', _removeBubble.bind(this));
            this.innerElement.textContent = '';
            this.innerElement.focus();

            if (this.add || typeof this.add === 'function') {
                this.add(div, _text);
            }

            if (this.click || typeof this.click === 'function') {
                div.addEventListener('click', this.click);
            }
        };

        /**
         * Removes bubble
         */
        this.removeBubble = function(node) {
            if (this.remove || typeof this.remove === 'function') {
                this.remove(node);
            }
            this.element.removeChild(node);
            this.refreshData();
        };

        /**
         * Removes last bubble
         */
        this.removeLastBubble = function() {
            if (_nodes.length) {
                _values.pop();
                var div = _nodes.pop();
                if (this.remove || typeof this.remove === 'function') {
                    this.remove(div);
                }
                this.element.removeChild(div);
            }
        };

        /**
         * Removes ALL nodes BUT not contentEditable from element
         * Clear data arrays
         */
        this.clearAll = function() {
            var allNodes =  _getAllNodes.call(this);
            for(var i = 0; i < allNodes.length; ++i) {
                if (this.remove || typeof this.remove === 'function') {
                    this.remove(allNodes[i]);
                }
                this.element.removeChild(allNodes[i]);
            }

            _values = [];
            _nodes = [];

            if (this.clear || typeof this.clear === 'function') {
                this.clear();
            }
        };

        /**
         * Returns bubbles as text values
         * @returns {Array}
         */
        this.values = function() {
            return _values;
        };

        /**
         * Returns bubbles as DOM nodes
         * @returns {Array}
         */
        this.nodes = function() {
            return _nodes;
        };

        /**
         * Refreshes _values and _nodes from DOM
         */
        this.refreshData = function() {
            _values = [];
            _nodes = [];

            var allNodes =  _getAllNodes.call(this);

            for(var i = 0; i < allNodes.length; ++i) {
                if(allNodes[i].className.indexOf('input-bubbles-placeholder') === -1) {
                    _nodes.push(allNodes[i]);
                    _values.push(allNodes[i].querySelector('.ui-bubble-content').textContent);
                }
            }

            _togglePlaceholder.call(this);
        };

        return function(options) {
            return _init.call(this, options);
        }.bind(this);


        // Private methods

        function _init(options) {
            if (options === null || typeof options === 'undefined') {
                throw new Error('Initialization without options!');
            }


            if (typeof options.childNodes !== 'undefined') {
                this.options = {
                    element: options
                };
            }

            else if (({}).toString.call(options).slice(8, -1) !== 'Object') {
                throw new Error('Invalid parameter "options"');
            }

            else if (typeof options.id !== 'undefined') {
                return this.initialized[options.id];
            }

            else {
                this.options = options;

                if (this.options.element === null || typeof this.options.element === 'undefined') {
                    throw new Error('Initializing without element or element was not found!');
                }
            }

            for (var key in this.options) {
                if (this.options[key] && typeof this.options[key] === 'function') {
                    this[key] = this.options[key];
                    delete this.options[key];
                }
            }

            this.element = this.options.element;

            this.options.height = this.options.height || 30;
            this.options.width = this.options.width || 370;

            this.element.style.minHeight = this.options.height + 'px';
            this.element.style.width = this.options.width + 'px';

            _clear.call(this);

            if (typeof options.placeholder !== 'undefined') {
                if (typeof options.placeholderClass !== 'undefined') {
                    _makePlaceholder.call(this, options.placeholder, options.placeholderClass);
                } else {
                    _makePlaceholder.call(this, options.placeholder);
                }
            }

            _makeEditable.call(this);

            this.innerElement.addEventListener('keyup', _onKeyUp.bind(this));
            this.innerElement.addEventListener('keydown', _onKeyDown.bind(this));
            this.innerElement.addEventListener('paste', _onPaste.bind(this));
            this.innerElement.addEventListener('input', _onInput.bind(this));

            var newGuid = _guid();
            this.initialized[newGuid] = this;
            this.element.setAttribute('data-input-bundles', newGuid);

            return this;
        }

        function _makeBubble(text) {
            return '<span class="ui-bubble-content" title="' + text + '" style="' +
            (this.options.bubbleTextWidth ? ('max-width: ' + this.options.bubbleTextWidth + 'px') : '') + '">' +
            text + '</span><span class="ui-bubble-remove">x</span>';
        }

        function _removeBubble(event) {
            event.stopPropagation();
            var node = event.currentTarget.parentNode;
            this.removeBubble(node);
        }

        function _onKeyDown(event) {
            _togglePlaceholder.call(this);

            if (event.keyCode === 13) {
                event.preventDefault();
            }
        }

        function _onKeyUp(event) {

            var position = cursorManager.getCaretPosition(this.innerElement);
            var text = this.innerElement.textContent;

            if ((event.keyCode === 32 && !this.options.allowSpaces && text.length >= position) || (event.keyCode === 13 && !this.options.allowEnter)) {
                this.addBubble();
            } else if (event.keyCode === 8 && this.toDeleteFlag) {
                this.removeLastBubble();
            } else if (this.options.separator) {
                if (text.length >= position) {
                    for (var i = 0; i < this.options.separator.length; ++i) {
                        if (text.indexOf(this.options.separator[i]) !== -1) {
                            var _text = text.replace(this.options.separator[i], '');
                            if (!_text) {
                                this.innerElement.textContent = '';
                                this.innerElement.focus();
                            } else {
                                this.addBubble(text.replace(this.options.separator[i], ''));
                            }
                            break;
                        }
                    }
                }
            }

            text = this.innerElement.textContent.trim();

            if (!text || position === 0) {
                this.toDeleteFlag = true;
            } else {
                this.toDeleteFlag = false;
            }

            _togglePlaceholder.call(this);

            if (this.keyup || typeof this.keyup === 'function') {
                this.keyup(event);
            }
        }

        function _togglePlaceholder() {
            var text = this.innerElement.textContent.trim();

            if (typeof this.placeholderElement !== 'undefined') {
                if (!text && !_nodes.length){
                    this.placeholderElement.style.display = 'block';
                } else {
                    this.placeholderElement.style.display = 'none';
                }
            }
        }

        function _onPaste() {
            setTimeout(function() {
                this.addBubble(_escapeHtml(this.innerElement.textContent));
            }.bind(this), 0);
        }

        function _onInput() {
            _togglePlaceholder.call(this);
        }

        function _clear() {
            while (this.element.firstChild) {
                this.element.removeChild(this.element.firstChild);
            }
        }

        function _makePlaceholder(text, className) {
            this.placeholderElement = document.createElement('div');
            this.placeholderElement.className = 'input-bubbles-placeholder ' + (typeof className !== 'undefined' ? className : '');
            this.placeholderElement.textContent = text;
            this.element.appendChild(this.placeholderElement);
        }

        function _makeEditable() {
            this.element.setAttribute('tabindex', 1);

            this.innerElement = document.createElement('div');
            this.innerElement.setAttribute('contenteditable', 'true');
            this.innerElement.className = 'ui-inner-editable';
            this.element.appendChild(this.innerElement);

            this.element.addEventListener('focus', function() {
                this.innerElement.focus();
                cursorManager.setEndOfContenteditable(this.innerElement);
            }.bind(this));

            this.innerElement.addEventListener('click', function() {
                if (cursorManager.getCaretPosition(this.innerElement) === 0) {
                    this.toDeleteFlag = true;
                } else {
                    this.toDeleteFlag = false;
                }
            }.bind(this));
        }

        function _getAllNodes() {
            var arr = [];
            var childNodes = this.element.childNodes;

            for (var i = 0; i < childNodes.length; ++i) {
                if (childNodes[i].nodeType == 1 &&
                    (!childNodes[i].getAttribute('contenteditable') || childNodes[i].getAttribute('contenteditable') === 'false')) {
                    arr.push(childNodes[i]);
                }
            }
            return arr;
        }

        function _escapeHtml(text) {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function _guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }
    }

    InputBubbles.prototype.initialized = {};

    window.inputBubbles = new InputBubbles();
})();
