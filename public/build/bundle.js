
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    class User {

        constructor() {
            this.isAuth = false;

            this.name = null;
            this.email = null;
            this.wins = 0;
            this.draws = 0;
            this.losses = 0;
            this.gamesPlayed = 0;
            this.leastMoves = 0;
            this.mostMoves = 0;
            this.totalMoves = 0;
            this.avgMovesPerGame = 0;
            this.leastTimePlayed = 0;
            this.mostTimePlayed = 0;
            this.totalTimePlayed = 0;
            this.avgTimePlayPerGame = 0;
            this.totalPoints = 0;
        }

        setProfile(data) {
            this.isAuth = true;
            
            this.name = data.name;
            this.email = data.email;
            this.wins = data.wins;
            this.draws = data.draws;
            this.losses = data.losses;
            this.gamesPlayed = data.gamesPlayed;        this.leastMoves = data.leastMoves;
            this.mostMoves = data.mostMoves;
            this.totalMoves = data.totalMoves;
            this.avgMovesPerGame = data.avgMovesPerGame;
            this.leastTimePlayed = data.leastTimePlayed;
            this.mostTimePlayed = data.mostTimePlayed;
            this.totalTimePlayed = data.totalTimePlayed;
            this.avgTimePlayPerGame = data.avgTimePlayPerGame;
            this.totalPoints = data.totalPoints;
        }
    }

    const currUser = writable(new User());

    const page = writable(0);

    /* src/Pages/dashBoard.svelte generated by Svelte v3.22.2 */
    const file = "src/Pages/dashBoard.svelte";

    function create_fragment(ctx) {
    	let div6;
    	let h1;
    	let t1;
    	let div0;
    	let t3;
    	let div1;
    	let t5;
    	let div2;
    	let t7;
    	let div3;
    	let t9;
    	let div4;
    	let t11;
    	let div5;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Dashboard";
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Create Game";
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = "Join Game";
    			t5 = space();
    			div2 = element("div");
    			div2.textContent = "View Games";
    			t7 = space();
    			div3 = element("div");
    			div3.textContent = "Leadership Board";
    			t9 = space();
    			div4 = element("div");
    			div4.textContent = "Tutorial";
    			t11 = space();
    			div5 = element("div");
    			div5.textContent = "Settings";
    			attr_dev(h1, "class", "svelte-vhgdn5");
    			add_location(h1, file, 8, 4, 100);
    			attr_dev(div0, "class", "circles svelte-vhgdn5");
    			add_location(div0, file, 10, 4, 124);
    			attr_dev(div1, "class", "circles svelte-vhgdn5");
    			add_location(div1, file, 14, 4, 182);
    			attr_dev(div2, "class", "circles svelte-vhgdn5");
    			add_location(div2, file, 18, 4, 238);
    			attr_dev(div3, "class", "circles svelte-vhgdn5");
    			add_location(div3, file, 22, 4, 295);
    			attr_dev(div4, "class", "circles svelte-vhgdn5");
    			add_location(div4, file, 26, 4, 359);
    			attr_dev(div5, "class", "circles svelte-vhgdn5");
    			add_location(div5, file, 30, 4, 415);
    			attr_dev(div6, "id", "backpurple");
    			attr_dev(div6, "class", "svelte-vhgdn5");
    			add_location(div6, file, 6, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, h1);
    			append_dev(div6, t1);
    			append_dev(div6, div0);
    			append_dev(div6, t3);
    			append_dev(div6, div1);
    			append_dev(div6, t5);
    			append_dev(div6, div2);
    			append_dev(div6, t7);
    			append_dev(div6, div3);
    			append_dev(div6, t9);
    			append_dev(div6, div4);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DashBoard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("DashBoard", $$slots, []);
    	$$self.$capture_state = () => ({ currUser });
    	return [];
    }

    class DashBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DashBoard",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    class Position {

        constructor(xPos, yPos, empty) {
            this.xPos = xPos;
            this.yPos = yPos;

            if(empty == 'E')
                this.isEmpty = true;
            else 
                this.isEmpty = false;
        }
    }

    class Piece {

        constructor(xPos, yPos, side, id, stack) {

            this.id = id;
            this.positon = new Position(xPos, yPos, side);
            this.side = side;

            if(stack != null)
                this.stack = stack;
            else
                this.stack = 1;
        }

        getPosition() {
            return this.positon;
        }

        setPosition(xPos, yPos) {
            this.positon = new Position(xPos, yPos, null);
        }

        incrementStack() {
            this.stack = 2;
        }
    }

    class Board {

        constructor(state) {

            if(!arguments.length) {

                this.board = [];

                let i, j, k = 0;

                for(i = 0; i < 8; i++) {

                    this.board[i] = [];
                
                    for(j = 0; j < 8; j++) {
                
                        let even = (i % 2 == 0) && (j % 2 == 0);
                        let odd = (i % 2 != 0) && (j % 2 != 0);
                
                        if(even || odd || i == 3 || i == 4) {
                        
                            this.board[i][j] = null;

                        } else  {

                            if(0 <= i && i <= 2)
                                this.board[i][j] = new Piece(i, j, 'U', k, null);
                                
                            else 
                                this.board[i][j] = new Piece(i, j, 'D', k, null);

                            k++;
                        }
                    }
                }
            } else {

                this.board = state;
            }
        }


        takePiece(piece, currPos, yDiff, nextPos) {

            let isTaken = false;
    /*
            if(piece.side == 'U' && piece.stack == 1) {

                let xPiece = currPos.xPos + 1;
                let yPiece = null;

                if(yDiff < 0)
                    yPiece = currPos.yPos - 1;
                if(yDiff > 0)
                    yPiece = currPos.yPos + 1;

                if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                    this.board[xPiece][yPiece] = null;
                    isTaken = true;
                }
            }

            if(piece.side == 'D' && piece.stack == 1) {

                let xPiece = currPos.xPos - 1;
                let yPiece = null;

                if(yDiff < 0)
                    yPiece = currPos.yPos + 1;
                if(yDiff > 0)
                    yPiece = currPos.yPos - 1;

                if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                    this.board[xPiece][yPiece] = null;
                    isTaken = true;
                }
            }

            if(piece.stack > 1) {
    */
                let xPiece = null;
                let yPiece = null;

                if(nextPos.xPos < currPos.xPos && nextPos.yPos < currPos.yPos) {

                    xPiece = currPos.xPos - 1;
                    yPiece = currPos.yPos - 1;

                    if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                        this.board[xPiece][yPiece] = null;
                        isTaken = true;
                    }
                }

                if(nextPos.xPos < currPos.xPos && nextPos.yPos > currPos.yPos) {

                    xPiece = currPos.xPos - 1;
                    yPiece = currPos.yPos + 1;

                    if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                        this.board[xPiece][yPiece] = null;
                        isTaken = true;
                    }
                }

                if(nextPos.xPos > currPos.xPos && nextPos.yPos < currPos.yPos) {

                    xPiece = currPos.xPos + 1;
                    yPiece = currPos.yPos - 1;

                    if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                        this.board[xPiece][yPiece] = null;
                        isTaken = true;
                    }
                }

                if(nextPos.xPos > currPos.xPos && nextPos.yPos > currPos.yPos) {

                    xPiece = currPos.xPos + 1;
                    yPiece = currPos.yPos + 1;

                    if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                        this.board[xPiece][yPiece] = null;
                        isTaken = true;
                    }
                }
            //}

            return isTaken;
        }


        isMoveLegal(piece, nextPos) {

            let legal = false;

            let currPos = piece.getPosition();

            if(piece.side == 'U' && nextPos.isEmpty) {

                let xDiff = nextPos.xPos - currPos.xPos;

                let yDiff = nextPos.yPos - currPos.yPos;

                if(piece.stack == 1) {

                    let oneSq = (yDiff == 1 || yDiff == -1) && xDiff == 1;

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq)
                        legal = true;

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                        legal = true;
                    }

                } else {

                    let oneSq = (xDiff == 1 || xDiff == -1) && (yDiff == 1 || yDiff == -1);

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq)
                        legal = true;

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                        legal = true;
                    }
                }
            }

            if(piece.side == 'D' && nextPos.isEmpty) {

                //console.log(currPos.xPos + ", " + currPos.yPos + " --> " + nextPos.xPos + ", " + nextPos.yPos);

                let xDiff = currPos.xPos - nextPos.xPos;

                let yDiff = currPos.yPos - nextPos.yPos;

                if(piece.stack == 1) {

                    //console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

                    let oneSq = (yDiff == 1 || yDiff == -1) && xDiff == 1;

                    //console.log(oneSq);

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq) {
                        //console.log(nextPos.xPos + ", " + nextPos.yPos);
                        legal = true;
                    }

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) 
                        legal = true;

                } else {

                    let oneSq = (xDiff == 1 || xDiff == -1) && (yDiff == 1 || yDiff == -1);

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq)
                        legal = true;

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) 
                        legal = true;
                }
            }

            return legal;
        }


        doMove(piece, nextPos) {

            let moved = false;

            if(this.isMoveLegal(piece, nextPos)) {

                this.scanBoard(piece, nextPos);

                let newPiece = new Piece(nextPos.xPos, nextPos.yPos, piece.side, piece.id, piece.stack);

                if(nextPos.xPos == 0 && newPiece.side == "D" && newPiece.stack == 1) 
                    newPiece.incrementStack();

                if(nextPos.xPos == 7 && newPiece.side == "U" && newPiece.stack == 1) 
                    newPiece.incrementStack();

                this.board[nextPos.xPos][nextPos.yPos] = newPiece;
                
                let currPos = piece.getPosition(); 

                this.board[currPos.xPos][currPos.yPos] = null;

                moved = true;
            }

            return moved;
        } 

        scanBoard(piece, nextPos) {

            let i, j;

            for(i = 0; i < 8; i++) {
                for(j = 0; j < 8; j++) {
                    if(this.board[i][j] != null && this.board[i][j].id != piece.id && this.board[i][j].side == piece.side) {
                        if(this.checkPiece(this.board[i][j], piece, nextPos)) {
                            break;
                        }
                    }
                }
            }
        }


        checkPiece(currPiece, piece, nextPos) {

            //console.log(currPiece.id);

            let autoRemove = false;

            let xNext = nextPos.xPos;
            let yNext = nextPos.yPos;

            let xPos = currPiece.getPosition().xPos;
            let yPos = currPiece.getPosition().yPos;

            if(0 <= xPos - 2 && 0 <= yPos - 2 && xPos - 2 <= 7 && yPos - 2 <= 7) {
                //console.log("Upper Left");
                if(this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side != piece.side && this.board[xPos - 2][yPos - 2] == null) {
                    this.board[xPos][yPos] = null;
                    autoRemove = true;
                    //console.log("Upper Left");
                }
            }

            if(0 <= xPos + 2 && 0 <= yPos + 2 && xPos + 2 <= 7 && yPos + 2 <= 7) {
                //console.log("Lower Right");
                if(autoRemove == false && this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                    this.board[xPos][yPos] = null;
                    autoRemove = true;
                    //console.log("Lower Right");
                }
            }

            if(0 <= xPos - 2 && 0 <= yPos + 2 && xPos - 2 <= 7 && yPos + 2 <= 7) {
                //console.log("Upper Right");
                if(autoRemove == false && this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                    this.board[xPos][yPos] = null;
                    autoRemove = true;
                    //console.log("Upper Right");
                }
            }

            if(0 <= xPos + 2 && 0 <= yPos - 2 && xPos + 2 <= 7 && yPos - 2 <= 7) {
                //console.log("Lower Left");
                if(autoRemove == false && this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                    this.board[xPos][yPos] = null;
                    autoRemove = true;
                    //console.log("Lower Left");
                }
            }

            return autoRemove;
        }


        isEmpty(xpos, ypos) {

            if(this.board[xpos][ypos] != null)
                return false;
            else
                return true;
        }

        getId(i, j) {
            return this.board[i][j].id;
        }

        getSide(i, j) {

            return this.board[i][j].side;
        }

        getPiece(i, j) {
            
            if(this.board[i][j] != null)
                return this.board[i][j];

        }

        getBoard() {
            return this.board;
        }

    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value)
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled)
                        task = null;
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    function invokeFunction(load) {
        return new Promise((resolve, reject) => {

            const url = "https://us-central1-checker-io.cloudfunctions.net/" + load.func;
            load = new URLSearchParams(load).toString();

            fetch(url, {
                method: 'post',
                mode: 'cors',
                body: load,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                'Access-Control-Allow-Origin' : '*'
            })
            .then(res => 
                res.json()
            )
            .then(json => {
                resolve(json);
            })
            .catch(err => 
                reject(err)
            );
        });
    }

    /* src/Pages/gameBoard.svelte generated by Svelte v3.22.2 */
    const file$1 = "src/Pages/gameBoard.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	return child_ctx;
    }

    // (244:0) {:else}
    function create_else_block_1(ctx) {
    	let div_1;

    	const block = {
    		c: function create() {
    			div_1 = element("div");
    			attr_dev(div_1, "class", "checker red svelte-za5d74");
    			add_location(div_1, file$1, 244, 1, 5194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div_1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(244:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (242:0) {#if currPlayer == 0}
    function create_if_block_7(ctx) {
    	let div_1;

    	const block = {
    		c: function create() {
    			div_1 = element("div");
    			attr_dev(div_1, "class", "checker black svelte-za5d74");
    			add_location(div_1, file$1, 242, 1, 5151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div_1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(242:0) {#if currPlayer == 0}",
    		ctx
    	});

    	return block;
    }

    // (250:0) {#if screenWidth > 800}
    function create_if_block_6(ctx) {
    	let h2;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text("Timer: ");
    			t1 = text(/*timer*/ ctx[2]);
    			attr_dev(h2, "id", "time");
    			attr_dev(h2, "class", "svelte-za5d74");
    			add_location(h2, file$1, 250, 1, 5297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*timer*/ 4) set_data_dev(t1, /*timer*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(250:0) {#if screenWidth > 800}",
    		ctx
    	});

    	return block;
    }

    // (265:38) 
    function create_if_block_4(ctx) {
    	let if_block_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*i*/ ctx[38] % 2 != 0 && /*j*/ ctx[41] % 2 == 0 || /*i*/ ctx[38] % 2 == 0 && /*j*/ ctx[41] % 2 != 0) return create_if_block_5;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(265:38) ",
    		ctx
    	});

    	return block;
    }

    // (258:4) {#if !gameBoard.isEmpty(i, j)}
    function create_if_block_1(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let show_if;
    	let show_if_1;
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*$cirPos, gameBoard*/ 320) show_if = !!(/*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].s == 0);
    		if (show_if) return create_if_block_2;
    		if (show_if_1 == null || dirty[0] & /*$cirPos, gameBoard*/ 320) show_if_1 = !!(/*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].s == 1);
    		if (show_if_1) return create_if_block_3;
    	}

    	let current_block_type = select_block_type_2(ctx, [-1]);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(rect, "width", "100");
    			attr_dev(rect, "height", "100");
    			set_style(rect, "fill", "brown");
    			attr_dev(rect, "x", rect_x_value = /*j*/ ctx[41] * /*squareSize*/ ctx[7]);
    			attr_dev(rect, "y", rect_y_value = /*i*/ ctx[38] * /*squareSize*/ ctx[7]);
    			add_location(rect, file$1, 258, 5, 5460);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*squareSize*/ 128 && rect_x_value !== (rect_x_value = /*j*/ ctx[41] * /*squareSize*/ ctx[7])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*squareSize*/ 128 && rect_y_value !== (rect_y_value = /*i*/ ctx[38] * /*squareSize*/ ctx[7])) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type_2(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);

    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(258:4) {#if !gameBoard.isEmpty(i, j)}",
    		ctx
    	});

    	return block;
    }

    // (268:5) {:else}
    function create_else_block(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "width", "100");
    			attr_dev(rect, "height", "100");
    			set_style(rect, "fill", "wheat");
    			attr_dev(rect, "x", rect_x_value = /*j*/ ctx[41] * /*squareSize*/ ctx[7]);
    			attr_dev(rect, "y", rect_y_value = /*i*/ ctx[38] * /*squareSize*/ ctx[7]);
    			add_location(rect, file$1, 268, 6, 6491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*squareSize*/ 128 && rect_x_value !== (rect_x_value = /*j*/ ctx[41] * /*squareSize*/ ctx[7])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*squareSize*/ 128 && rect_y_value !== (rect_y_value = /*i*/ ctx[38] * /*squareSize*/ ctx[7])) {
    				attr_dev(rect, "y", rect_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(268:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (266:5) {#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}
    function create_if_block_5(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[32](/*i*/ ctx[38], /*j*/ ctx[41], ...args);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "width", "100");
    			attr_dev(rect, "height", "100");
    			set_style(rect, "fill", "brown");
    			attr_dev(rect, "x", rect_x_value = /*j*/ ctx[41] * /*squareSize*/ ctx[7]);
    			attr_dev(rect, "y", rect_y_value = /*i*/ ctx[38] * /*squareSize*/ ctx[7]);
    			add_location(rect, file$1, 266, 6, 6341);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, rect, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(rect, "click", click_handler_2, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*squareSize*/ 128 && rect_x_value !== (rect_x_value = /*j*/ ctx[41] * /*squareSize*/ ctx[7])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*squareSize*/ 128 && rect_y_value !== (rect_y_value = /*i*/ ctx[38] * /*squareSize*/ ctx[7])) {
    				attr_dev(rect, "y", rect_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(266:5) {#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}",
    		ctx
    	});

    	return block;
    }

    // (262:53) 
    function create_if_block_3(ctx) {
    	let circle;
    	let circle_id_value;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_stroke_width_value;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[31](/*i*/ ctx[38], /*j*/ ctx[41], ...args);
    	}

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "checkRed svelte-za5d74");
    			attr_dev(circle, "id", circle_id_value = /*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41]));
    			attr_dev(circle, "cx", circle_cx_value = /*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].y);
    			attr_dev(circle, "cy", circle_cy_value = /*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].x);
    			attr_dev(circle, "r", /*$size*/ ctx[9]);
    			attr_dev(circle, "stroke", "white");
    			attr_dev(circle, "stroke-width", circle_stroke_width_value = /*gameBoard*/ ctx[6].getPiece(/*i*/ ctx[38], /*j*/ ctx[41]).stack * 2);
    			attr_dev(circle, "fill", "red");
    			add_location(circle, file$1, 262, 6, 5943);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, circle, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(circle, "click", click_handler_1, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*gameBoard*/ 64 && circle_id_value !== (circle_id_value = /*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41]))) {
    				attr_dev(circle, "id", circle_id_value);
    			}

    			if (dirty[0] & /*$cirPos, gameBoard*/ 320 && circle_cx_value !== (circle_cx_value = /*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].y)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty[0] & /*$cirPos, gameBoard*/ 320 && circle_cy_value !== (circle_cy_value = /*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].x)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty[0] & /*$size*/ 512) {
    				attr_dev(circle, "r", /*$size*/ ctx[9]);
    			}

    			if (dirty[0] & /*gameBoard*/ 64 && circle_stroke_width_value !== (circle_stroke_width_value = /*gameBoard*/ ctx[6].getPiece(/*i*/ ctx[38], /*j*/ ctx[41]).stack * 2)) {
    				attr_dev(circle, "stroke-width", circle_stroke_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(262:53) ",
    		ctx
    	});

    	return block;
    }

    // (260:5) {#if $cirPos[gameBoard.getId(i, j)].s == 0}
    function create_if_block_2(ctx) {
    	let circle;
    	let circle_id_value;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_stroke_width_value;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[30](/*i*/ ctx[38], /*j*/ ctx[41], ...args);
    	}

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "checkBlack svelte-za5d74");
    			attr_dev(circle, "id", circle_id_value = /*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41]));
    			attr_dev(circle, "cx", circle_cx_value = /*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].y);
    			attr_dev(circle, "cy", circle_cy_value = /*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].x);
    			attr_dev(circle, "r", /*$size*/ ctx[9]);
    			attr_dev(circle, "stroke", "white");
    			attr_dev(circle, "stroke-width", circle_stroke_width_value = /*gameBoard*/ ctx[6].getPiece(/*i*/ ctx[38], /*j*/ ctx[41]).stack * 2);
    			attr_dev(circle, "fill", "black");
    			add_location(circle, file$1, 260, 6, 5610);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, circle, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(circle, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*gameBoard*/ 64 && circle_id_value !== (circle_id_value = /*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41]))) {
    				attr_dev(circle, "id", circle_id_value);
    			}

    			if (dirty[0] & /*$cirPos, gameBoard*/ 320 && circle_cx_value !== (circle_cx_value = /*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].y)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty[0] & /*$cirPos, gameBoard*/ 320 && circle_cy_value !== (circle_cy_value = /*$cirPos*/ ctx[8][/*gameBoard*/ ctx[6].getId(/*i*/ ctx[38], /*j*/ ctx[41])].x)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty[0] & /*$size*/ 512) {
    				attr_dev(circle, "r", /*$size*/ ctx[9]);
    			}

    			if (dirty[0] & /*gameBoard*/ 64 && circle_stroke_width_value !== (circle_stroke_width_value = /*gameBoard*/ ctx[6].getPiece(/*i*/ ctx[38], /*j*/ ctx[41]).stack * 2)) {
    				attr_dev(circle, "stroke-width", circle_stroke_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(260:5) {#if $cirPos[gameBoard.getId(i, j)].s == 0}",
    		ctx
    	});

    	return block;
    }

    // (257:3) {#each squares as j}
    function create_each_block_2(ctx) {
    	let show_if;
    	let show_if_1;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*gameBoard*/ 64) show_if = !!!/*gameBoard*/ ctx[6].isEmpty(/*i*/ ctx[38], /*j*/ ctx[41]);
    		if (show_if) return create_if_block_1;
    		if (show_if_1 == null || dirty[0] & /*gameBoard*/ 64) show_if_1 = !!/*gameBoard*/ ctx[6].isEmpty(/*i*/ ctx[38], /*j*/ ctx[41]);
    		if (show_if_1) return create_if_block_4;
    	}

    	let current_block_type = select_block_type_1(ctx, [-1]);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(257:3) {#each squares as j}",
    		ctx
    	});

    	return block;
    }

    // (256:2) {#each squares as i}
    function create_each_block_1(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*squares*/ ctx[13];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*gameBoard, squares, $cirPos, $size, setCurrPos, squareSize, setNextPos*/ 58304) {
    				each_value_2 = /*squares*/ ctx[13];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(256:2) {#each squares as i}",
    		ctx
    	});

    	return block;
    }

    // (278:0) {#if screenWidth <= 800}
    function create_if_block(ctx) {
    	let h1;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Timer: ");
    			t1 = text(/*timer*/ ctx[2]);
    			attr_dev(h1, "id", "time");
    			attr_dev(h1, "class", "svelte-za5d74");
    			add_location(h1, file$1, 278, 1, 6705);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*timer*/ 4) set_data_dev(t1, /*timer*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(278:0) {#if screenWidth <= 800}",
    		ctx
    	});

    	return block;
    }

    // (293:2) {#each msgs as msg}
    function create_each_block(ctx) {
    	let article;
    	let span;
    	let t0_value = /*msg*/ ctx[35].text + "";
    	let t0;
    	let t1;
    	let article_class_value;

    	const block = {
    		c: function create() {
    			article = element("article");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(span, file$1, 294, 4, 7171);
    			attr_dev(article, "class", article_class_value = "" + (null_to_empty(/*msg*/ ctx[35].author) + " svelte-za5d74"));
    			add_location(article, file$1, 293, 3, 7138);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, span);
    			append_dev(span, t0);
    			append_dev(article, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(293:2) {#each msgs as msg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let h20;
    	let t1;
    	let t2;
    	let h21;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let div0;
    	let svg1;
    	let use;
    	let svg0;
    	let t7;
    	let t8;
    	let div1;
    	let label;
    	let h22;
    	let t9;
    	let t10;
    	let t11;
    	let input0;
    	let t12;
    	let div3;
    	let h4;
    	let t14;
    	let div2;
    	let t15;
    	let input1;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*currPlayer*/ ctx[1] == 0) return create_if_block_7;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*screenWidth*/ ctx[11] > 800 && create_if_block_6(ctx);
    	let each_value_1 = /*squares*/ ctx[13];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block2 = /*screenWidth*/ ctx[11] <= 800 && create_if_block(ctx);
    	let each_value = /*msgs*/ ctx[10];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h20 = element("h2");
    			h20.textContent = "Current Player:";
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			h21 = element("h2");
    			t3 = text("Moves: ");
    			t4 = text(/*numMoves*/ ctx[3]);
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			div0 = element("div");
    			svg1 = svg_element("svg");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			use = svg_element("use");
    			svg0 = svg_element("svg");
    			t7 = space();
    			if (if_block2) if_block2.c();
    			t8 = space();
    			div1 = element("div");
    			label = element("label");
    			h22 = element("h2");
    			t9 = text("Game State at Move: ");
    			t10 = text(/*rangeMoves*/ ctx[4]);
    			t11 = space();
    			input0 = element("input");
    			t12 = space();
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Other Player";
    			t14 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t15 = space();
    			input1 = element("input");
    			attr_dev(h20, "id", "player");
    			attr_dev(h20, "class", "svelte-za5d74");
    			add_location(h20, file$1, 239, 0, 5090);
    			attr_dev(h21, "id", "moves");
    			attr_dev(h21, "class", "svelte-za5d74");
    			add_location(h21, file$1, 247, 0, 5233);
    			attr_dev(use, "id", "use");
    			xlink_attr(use, "xlink:href", "#24");
    			add_location(use, file$1, 273, 2, 6630);
    			add_location(svg0, file$1, 274, 1, 6665);
    			attr_dev(svg1, "id", "hover");
    			attr_dev(svg1, "class", "svelte-za5d74");
    			add_location(svg1, file$1, 254, 1, 5356);
    			attr_dev(div0, "id", "board");
    			attr_dev(div0, "class", "svelte-za5d74");
    			add_location(div0, file$1, 253, 0, 5338);
    			attr_dev(h22, "id", "rangeBar");
    			attr_dev(h22, "class", "svelte-za5d74");
    			add_location(h22, file$1, 283, 2, 6774);
    			attr_dev(input0, "class", "custom-range svelte-za5d74");
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "max", /*numMoves*/ ctx[3]);
    			attr_dev(input0, "step", "1");
    			add_location(input0, file$1, 284, 2, 6832);
    			add_location(label, file$1, 282, 1, 6764);
    			attr_dev(div1, "id", "state");
    			attr_dev(div1, "class", "svelte-za5d74");
    			add_location(div1, file$1, 281, 0, 6746);
    			set_style(h4, "text-align", "center");
    			add_location(h4, file$1, 289, 1, 7022);
    			attr_dev(div2, "class", "scrollable svelte-za5d74");
    			add_location(div2, file$1, 291, 1, 7072);
    			attr_dev(input1, "id", "user-msg");
    			attr_dev(input1, "class", "svelte-za5d74");
    			add_location(input1, file$1, 299, 1, 7229);
    			attr_dev(div3, "id", "chat");
    			attr_dev(div3, "class", "container-fluid svelte-za5d74");
    			add_location(div3, file$1, 288, 0, 6981);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t1, anchor);
    			if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h21, anchor);
    			append_dev(h21, t3);
    			append_dev(h21, t4);
    			insert_dev(target, t5, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, svg1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(svg1, null);
    			}

    			append_dev(svg1, use);
    			append_dev(svg1, svg0);
    			insert_dev(target, t7, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(label, h22);
    			append_dev(h22, t9);
    			append_dev(h22, t10);
    			append_dev(label, t11);
    			append_dev(label, input0);
    			set_input_value(input0, /*rangeMoves*/ ctx[4]);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h4);
    			append_dev(div3, t14);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			/*div2_binding*/ ctx[34](div2);
    			append_dev(div3, t15);
    			append_dev(div3, input1);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "change", /*viewBoardHistory*/ ctx[16], false, false, false),
    				listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[33]),
    				listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[33])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t2.parentNode, t2);
    				}
    			}

    			if (dirty[0] & /*numMoves*/ 8) set_data_dev(t4, /*numMoves*/ ctx[3]);
    			if (/*screenWidth*/ ctx[11] > 800) if_block1.p(ctx, dirty);

    			if (dirty[0] & /*squares, gameBoard, $cirPos, $size, setCurrPos, squareSize, setNextPos*/ 58304) {
    				each_value_1 = /*squares*/ ctx[13];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(svg1, use);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (/*screenWidth*/ ctx[11] <= 800) if_block2.p(ctx, dirty);
    			if (dirty[0] & /*rangeMoves*/ 16) set_data_dev(t10, /*rangeMoves*/ ctx[4]);

    			if (dirty[0] & /*numMoves*/ 8) {
    				attr_dev(input0, "max", /*numMoves*/ ctx[3]);
    			}

    			if (dirty[0] & /*rangeMoves*/ 16) {
    				set_input_value(input0, /*rangeMoves*/ ctx[4]);
    			}

    			if (dirty[0] & /*msgs*/ 1024) {
    				each_value = /*msgs*/ ctx[10];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t1);
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t5);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t7);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			/*div2_binding*/ ctx[34](null);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $cirPos;

    	let $size,
    		$$unsubscribe_size = noop,
    		$$subscribe_size = () => ($$unsubscribe_size(), $$unsubscribe_size = subscribe(size, $$value => $$invalidate(9, $size = $$value)), size);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_size());
    	let div, autoscroll;
    	let msgs = [];
    	let currPlayer = Math.floor(Math.random() * 2);
    	let currPos = null, nextPos = null;
    	let timer = 10, lockedPiece = false;
    	let screenWidth = screen.width, remWidth;
    	let numMoves = 0, rangeMoves = 0;
    	let size;
    	validate_store(size, "size");
    	$$subscribe_size();
    	let gameBoard = new Board();
    	let gameHistory = [];
    	const cirPos = spring([]);
    	validate_store(cirPos, "cirPos");
    	component_subscribe($$self, cirPos, value => $$invalidate(8, $cirPos = value));
    	let squares = [0, 1, 2, 3, 4, 5, 6, 7];
    	let squareSize, boardHeight, factor;

    	if (screen.width <= 800) {
    		factor = 800 / (screen.width - 12.5);
    		squareSize = Math.floor((screen.width - 10) / 8);
    		if (screen.width >= 500) $$subscribe_size(size = spring(25)); else $$subscribe_size(size = spring(12.5));
    		boardHeight = squareSize * 8;
    		remWidth = screen.width;
    	} else {
    		factor = 1;
    		$$subscribe_size(size = spring(30));
    		squareSize = 100;
    		boardHeight = squareSize * 8;
    		remWidth = 0.8 * (screen.width - 800);
    	}

    	document.documentElement.style.setProperty("--chat-width", remWidth + "px");
    	document.documentElement.style.setProperty("--board-height", boardHeight + "px");
    	saveBoardState();
    	setCirclePositions();

    	setInterval(
    		function () {
    			if (currPos != null) highlightCircle(currPos);
    		},
    		100
    	);

    	setInterval(
    		function () {
    			if (rangeMoves == numMoves) {
    				$$invalidate(2, timer--, timer);

    				if (timer == -1) {
    					switchPlayer();
    					$$invalidate(2, timer = 10);
    				}
    			}
    		},
    		1000
    	);

    	function updateCirclePositions(nextPos) {
    		let i = nextPos.xPos, j = nextPos.yPos;
    		let id = gameBoard.getId(i, j);

    		cirPos.update(state => {
    			state[id].x = (i + i + 1) * (50 / factor);
    			state[id].y = (j + j + 1) * (50 / factor);
    			return state;
    		});
    	}

    	function setCirclePositions() {
    		for (let i = 0; i < 8; i++) {
    			for (let j = 0; j < 8; j++) {
    				if (!gameBoard.isEmpty(i, j)) {
    					let id = gameBoard.getId(i, j);

    					cirPos.update(state => {
    						state[id] = {};
    						state[id].x = (i + i + 1) * (50 / factor);
    						state[id].y = (j + j + 1) * (50 / factor);
    						state[id].s = gameBoard.getSide(i, j) == "U" ? 0 : 1;
    						return state;
    					});
    				}
    			}
    		}
    	}

    	function setCurrPos(i, j, evt) {
    		//console.log(i + ", " + j);
    		if ($cirPos[gameBoard.getId(i, j)].s == currPlayer && lockedPiece == false && rangeMoves == numMoves) {
    			let litCircle = document.getElementById(gameBoard.getId(i, j));
    			let allCircles, index;

    			if (gameBoard.getSide(i, j) == "U") {
    				allCircles = document.getElementsByClassName("checkBlack");
    				for (index = 0; index < allCircles.length; ++index) allCircles[index].setAttribute("style", "fill:black");
    				litCircle.setAttribute("style", "fill:grey");
    			} else {
    				allCircles = document.getElementsByClassName("checkRed");
    				for (index = 0; index < allCircles.length; ++index) allCircles[index].setAttribute("style", "fill:red");
    				litCircle.setAttribute("style", "fill:pink");
    			}

    			let newtarget = evt.target || event.target;
    			let topmost = document.getElementById("use");
    			topmost.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + newtarget.id);
    			currPos = gameBoard.getPiece(i, j);
    		}
    	} //let pos = currPos.getPosition();
    	//console.log(pos.xPos + ", " + pos.yPos);

    	function setNextPos(i, j) {
    		if (gameBoard.isEmpty(i, j) && currPos != null && rangeMoves == numMoves) {
    			nextPos = new Position(i, j, "E");
    			let move = gameBoard.doMove(currPos, nextPos);
    			$$invalidate(6, gameBoard);

    			//console.log(gameBoard);
    			if (move) {
    				lockedPiece = true;
    				updateCirclePositions(nextPos);
    				saveBoardState();
    				$$invalidate(3, numMoves++, numMoves);
    				$$invalidate(4, rangeMoves++, rangeMoves);
    				currPos = gameBoard.getPiece(nextPos.xPos, nextPos.yPos);
    			}
    		}
    	}

    	function viewBoardHistory() {
    		$$invalidate(6, gameBoard = new Board(gameHistory[rangeMoves]));
    		setCirclePositions();
    	}

    	function highlightCircle(currPos) {
    		let i = currPos.getPosition().xPos, j = currPos.getPosition().yPos;
    		let litCircle = document.getElementById(gameBoard.getId(i, j));
    		if (gameBoard.getSide(i, j) == "U") litCircle.setAttribute("style", "fill:grey"); else litCircle.setAttribute("style", "fill:pink");
    	}

    	function switchPlayer() {
    		let allCircles, index;

    		if (currPlayer == 0) {
    			allCircles = document.getElementsByClassName("checkBlack");
    			for (index = 0; index < allCircles.length; ++index) allCircles[index].setAttribute("style", "fill:black");
    		} else {
    			allCircles = document.getElementsByClassName("checkRed");
    			for (index = 0; index < allCircles.length; ++index) allCircles[index].setAttribute("style", "fill:red");
    		}

    		$$invalidate(1, currPlayer = currPlayer == 0 ? 1 : 0);
    		(currPos = null, nextPos = null);
    		lockedPiece = false;
    	}

    	function saveBoardState() {
    		let state = [];
    		let i, j;

    		for (i = 0; i < 8; i++) {
    			state[i] = [];

    			for (j = 0; j < 8; j++) {
    				if (!gameBoard.isEmpty(i, j)) state[i][j] = gameBoard.getPiece(i, j); else state[i][j] = null;
    			}
    		}

    		gameHistory.push(state);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameBoard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameBoard", $$slots, []);
    	const click_handler = (i, j) => setCurrPos(i, j, event);
    	const click_handler_1 = (i, j) => setCurrPos(i, j, event);
    	const click_handler_2 = (i, j) => setNextPos(i, j);

    	function input0_change_input_handler() {
    		rangeMoves = to_number(this.value);
    		$$invalidate(4, rangeMoves);
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, div = $$value);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Position,
    		Board,
    		spring,
    		writable,
    		invokeFunction,
    		div,
    		autoscroll,
    		msgs,
    		currPlayer,
    		currPos,
    		nextPos,
    		timer,
    		lockedPiece,
    		screenWidth,
    		remWidth,
    		numMoves,
    		rangeMoves,
    		size,
    		gameBoard,
    		gameHistory,
    		cirPos,
    		squares,
    		squareSize,
    		boardHeight,
    		factor,
    		updateCirclePositions,
    		setCirclePositions,
    		setCurrPos,
    		setNextPos,
    		viewBoardHistory,
    		highlightCircle,
    		switchPlayer,
    		saveBoardState,
    		$cirPos,
    		$size
    	});

    	$$self.$inject_state = $$props => {
    		if ("div" in $$props) $$invalidate(0, div = $$props.div);
    		if ("autoscroll" in $$props) autoscroll = $$props.autoscroll;
    		if ("msgs" in $$props) $$invalidate(10, msgs = $$props.msgs);
    		if ("currPlayer" in $$props) $$invalidate(1, currPlayer = $$props.currPlayer);
    		if ("currPos" in $$props) currPos = $$props.currPos;
    		if ("nextPos" in $$props) nextPos = $$props.nextPos;
    		if ("timer" in $$props) $$invalidate(2, timer = $$props.timer);
    		if ("lockedPiece" in $$props) lockedPiece = $$props.lockedPiece;
    		if ("screenWidth" in $$props) $$invalidate(11, screenWidth = $$props.screenWidth);
    		if ("remWidth" in $$props) remWidth = $$props.remWidth;
    		if ("numMoves" in $$props) $$invalidate(3, numMoves = $$props.numMoves);
    		if ("rangeMoves" in $$props) $$invalidate(4, rangeMoves = $$props.rangeMoves);
    		if ("size" in $$props) $$subscribe_size($$invalidate(5, size = $$props.size));
    		if ("gameBoard" in $$props) $$invalidate(6, gameBoard = $$props.gameBoard);
    		if ("gameHistory" in $$props) gameHistory = $$props.gameHistory;
    		if ("squares" in $$props) $$invalidate(13, squares = $$props.squares);
    		if ("squareSize" in $$props) $$invalidate(7, squareSize = $$props.squareSize);
    		if ("boardHeight" in $$props) boardHeight = $$props.boardHeight;
    		if ("factor" in $$props) factor = $$props.factor;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		div,
    		currPlayer,
    		timer,
    		numMoves,
    		rangeMoves,
    		size,
    		gameBoard,
    		squareSize,
    		$cirPos,
    		$size,
    		msgs,
    		screenWidth,
    		cirPos,
    		squares,
    		setCurrPos,
    		setNextPos,
    		viewBoardHistory,
    		currPos,
    		nextPos,
    		lockedPiece,
    		remWidth,
    		boardHeight,
    		factor,
    		autoscroll,
    		gameHistory,
    		updateCirclePositions,
    		setCirclePositions,
    		highlightCircle,
    		switchPlayer,
    		saveBoardState,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		input0_change_input_handler,
    		div2_binding
    	];
    }

    class GameBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameBoard",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/Pages/entry.svelte generated by Svelte v3.22.2 */

    const { console: console_1 } = globals;
    const file$2 = "src/Pages/entry.svelte";

    // (110:4) {:else}
    function create_else_block$1(ctx) {
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let input3;
    	let t3;
    	let button;
    	let t5;
    	let h5;
    	let t6;
    	let span;
    	let dispose;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			input3 = element("input");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Sign Up";
    			t5 = space();
    			h5 = element("h5");
    			t6 = text("Already have an Account? ");
    			span = element("span");
    			span.textContent = "Sign In";
    			attr_dev(input0, "id", "Name");
    			attr_dev(input0, "placeholder", "Display Name");
    			attr_dev(input0, "class", "svelte-1ar2wx5");
    			add_location(input0, file$2, 110, 8, 3142);
    			attr_dev(input1, "id", "Email");
    			attr_dev(input1, "placeholder", "Email");
    			attr_dev(input1, "class", "svelte-1ar2wx5");
    			add_location(input1, file$2, 111, 8, 3216);
    			attr_dev(input2, "id", "Password");
    			attr_dev(input2, "placeholder", "Password");
    			attr_dev(input2, "class", "svelte-1ar2wx5");
    			add_location(input2, file$2, 112, 8, 3285);
    			attr_dev(input3, "id", "confirmPassword");
    			attr_dev(input3, "placeholder", "Confirm Password");
    			attr_dev(input3, "class", "svelte-1ar2wx5");
    			add_location(input3, file$2, 113, 8, 3363);
    			attr_dev(button, "class", "btn btn-success svelte-1ar2wx5");
    			add_location(button, file$2, 114, 8, 3463);
    			attr_dev(span, "class", "svelte-1ar2wx5");
    			add_location(span, file$2, 116, 37, 3570);
    			attr_dev(h5, "class", "svelte-1ar2wx5");
    			add_location(h5, file$2, 116, 8, 3541);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*Name*/ ctx[1]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*Email*/ ctx[0]);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*Password*/ ctx[2]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input3, anchor);
    			set_input_value(input3, /*confirmPassword*/ ctx[3]);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t6);
    			append_dev(h5, span);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[15]),
    				listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[16]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[17]),
    				listen_dev(input3, "input", /*input3_input_handler*/ ctx[18]),
    				listen_dev(button, "click", /*signUp*/ ctx[7], false, false, false),
    				listen_dev(span, "click", /*click_handler_1*/ ctx[19], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Name*/ 2 && input0.value !== /*Name*/ ctx[1]) {
    				set_input_value(input0, /*Name*/ ctx[1]);
    			}

    			if (dirty & /*Email*/ 1 && input1.value !== /*Email*/ ctx[0]) {
    				set_input_value(input1, /*Email*/ ctx[0]);
    			}

    			if (dirty & /*Password*/ 4 && input2.value !== /*Password*/ ctx[2]) {
    				set_input_value(input2, /*Password*/ ctx[2]);
    			}

    			if (dirty & /*confirmPassword*/ 8 && input3.value !== /*confirmPassword*/ ctx[3]) {
    				set_input_value(input3, /*confirmPassword*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input3);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(h5);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(110:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (103:4) {#if logPage}
    function create_if_block$1(ctx) {
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let button;
    	let t3;
    	let h5;
    	let t4;
    	let span;
    	let t6;
    	let hr;
    	let dispose;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Log In";
    			t3 = space();
    			h5 = element("h5");
    			t4 = text("Don't have an Account? ");
    			span = element("span");
    			span.textContent = "Sign Up";
    			t6 = space();
    			hr = element("hr");
    			attr_dev(input0, "id", "logEmail");
    			attr_dev(input0, "placeholder", "Email");
    			attr_dev(input0, "class", "svelte-1ar2wx5");
    			add_location(input0, file$2, 103, 8, 2779);
    			attr_dev(input1, "id", "logPassword");
    			attr_dev(input1, "placeholder", "Password");
    			attr_dev(input1, "class", "svelte-1ar2wx5");
    			add_location(input1, file$2, 104, 8, 2854);
    			attr_dev(button, "class", "btn btn-success svelte-1ar2wx5");
    			add_location(button, file$2, 105, 8, 2938);
    			attr_dev(span, "class", "svelte-1ar2wx5");
    			add_location(span, file$2, 107, 35, 3042);
    			attr_dev(h5, "class", "svelte-1ar2wx5");
    			add_location(h5, file$2, 107, 8, 3015);
    			add_location(hr, file$2, 108, 8, 3116);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*logEmail*/ ctx[4]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*logPassword*/ ctx[5]);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t4);
    			append_dev(h5, span);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, hr, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
    				listen_dev(button, "click", /*signIn*/ ctx[8], false, false, false),
    				listen_dev(span, "click", /*click_handler*/ ctx[14], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*logEmail*/ 16 && input0.value !== /*logEmail*/ ctx[4]) {
    				set_input_value(input0, /*logEmail*/ ctx[4]);
    			}

    			if (dirty & /*logPassword*/ 32 && input1.value !== /*logPassword*/ ctx[5]) {
    				set_input_value(input1, /*logPassword*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(hr);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(103:4) {#if logPage}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let t2;
    	let img;
    	let img_src_value;

    	function select_block_type(ctx, dirty) {
    		if (/*logPage*/ ctx[6]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Welcome To Checkers.io";
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			img = element("img");
    			attr_dev(h3, "class", "svelte-1ar2wx5");
    			add_location(h3, file$2, 101, 4, 2721);
    			attr_dev(div, "id", "entry");
    			attr_dev(div, "class", "container svelte-1ar2wx5");
    			add_location(div, file$2, 100, 0, 2682);
    			attr_dev(img, "id", "back-image");
    			attr_dev(img, "alt", "checker");
    			if (img.src !== (img_src_value = "./images/checkers.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1ar2wx5");
    			add_location(img, file$2, 119, 0, 3653);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			if_block.m(div, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let Email, Name, Password, confirmPassword;
    	let logEmail, logPassword;
    	let request;
    	let logPage = true;

    	function signUp() {
    		if (Email != null && Name != null && Password != null && confirmPassword != null && Password == confirmPassword) {
    			request = {
    				func: "signUp",
    				email: Email,
    				name: Name,
    				password: Password
    			};

    			invokeFunction(request).then(response => {
    				console.log(response);

    				if (response.msg == "SUCCESS") {
    					request.func = "createUser";
    					createUser();
    				} else {
    					console.log(response.err);
    				}
    			}).catch(err => {
    				console.log(err);
    			});
    		}
    	}

    	function createUser() {
    		invokeFunction(request).then(response => {
    			console.log(response);

    			if (response.msg == "SUCCESS") {
    				request.func = "retrieveUser";
    				retrieveUser();
    			} else {
    				console.log(response.err);
    			}
    		}).catch(err => {
    			console.log(err);
    		});
    	}

    	function signIn() {
    		if (logEmail != null && logPassword != null) {
    			request = {
    				func: "signIn",
    				email: logEmail,
    				password: logPassword
    			};

    			invokeFunction(request).then(response => {
    				if (response.msg == "SUCCESS") {
    					request.func = "retrieveUser";
    					retrieveUser();
    				} else {
    					console.log(response.err);
    				}
    			}).catch(err => {
    				console.log(err);
    			});
    		}
    	}

    	function retrieveUser() {
    		invokeFunction(request).then(response => {
    			//console.log(response);
    			if (response.msg != null) {
    				let data = response.msg;
    				data.email = logEmail != null ? logEmail : Email;

    				currUser.update(state => {
    					state.setProfile(data);
    					return state;
    				});

    				($$invalidate(0, Email = ""), $$invalidate(1, Name = ""), $$invalidate(2, Password = ""), $$invalidate(3, confirmPassword = ""));
    				($$invalidate(4, logEmail = ""), $$invalidate(5, logPassword = ""));
    			} else {
    				console.log(response.err);
    			}
    		}).catch(err => {
    			console.log(err);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Entry> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Entry", $$slots, []);

    	function input0_input_handler() {
    		logEmail = this.value;
    		$$invalidate(4, logEmail);
    	}

    	function input1_input_handler() {
    		logPassword = this.value;
    		$$invalidate(5, logPassword);
    	}

    	const click_handler = () => $$invalidate(6, logPage = !logPage);

    	function input0_input_handler_1() {
    		Name = this.value;
    		$$invalidate(1, Name);
    	}

    	function input1_input_handler_1() {
    		Email = this.value;
    		$$invalidate(0, Email);
    	}

    	function input2_input_handler() {
    		Password = this.value;
    		$$invalidate(2, Password);
    	}

    	function input3_input_handler() {
    		confirmPassword = this.value;
    		$$invalidate(3, confirmPassword);
    	}

    	const click_handler_1 = () => $$invalidate(6, logPage = !logPage);

    	$$self.$capture_state = () => ({
    		currUser,
    		page,
    		invokeFunction,
    		Email,
    		Name,
    		Password,
    		confirmPassword,
    		logEmail,
    		logPassword,
    		request,
    		logPage,
    		signUp,
    		createUser,
    		signIn,
    		retrieveUser
    	});

    	$$self.$inject_state = $$props => {
    		if ("Email" in $$props) $$invalidate(0, Email = $$props.Email);
    		if ("Name" in $$props) $$invalidate(1, Name = $$props.Name);
    		if ("Password" in $$props) $$invalidate(2, Password = $$props.Password);
    		if ("confirmPassword" in $$props) $$invalidate(3, confirmPassword = $$props.confirmPassword);
    		if ("logEmail" in $$props) $$invalidate(4, logEmail = $$props.logEmail);
    		if ("logPassword" in $$props) $$invalidate(5, logPassword = $$props.logPassword);
    		if ("request" in $$props) request = $$props.request;
    		if ("logPage" in $$props) $$invalidate(6, logPage = $$props.logPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		Email,
    		Name,
    		Password,
    		confirmPassword,
    		logEmail,
    		logPassword,
    		logPage,
    		signUp,
    		signIn,
    		request,
    		createUser,
    		retrieveUser,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		click_handler_1
    	];
    }

    class Entry extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Entry",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.22.2 */

    // (14:0) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const entry = new Entry({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(entry.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(entry, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entry.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entry.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(entry, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(14:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if !$currUser.isAuth}
    function create_if_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$page*/ ctx[1] == 0) return 0;
    		if (/*$page*/ ctx[1] == 1) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(8:0) {#if !$currUser.isAuth}",
    		ctx
    	});

    	return block;
    }

    // (11:22) 
    function create_if_block_2$1(ctx) {
    	let current;
    	const board = new GameBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(board.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(board, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(board.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(board.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(board, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(11:22) ",
    		ctx
    	});

    	return block;
    }

    // (9:1) {#if $page == 0}
    function create_if_block_1$1(ctx) {
    	let current;
    	const dash = new DashBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dash.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dash, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dash.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dash.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dash, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(9:1) {#if $page == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*$currUser*/ ctx[0].isAuth) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $currUser;
    	let $page;
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(0, $currUser = $$value));
    	validate_store(page, "page");
    	component_subscribe($$self, page, $$value => $$invalidate(1, $page = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Dash: DashBoard,
    		Board: GameBoard,
    		Entry,
    		currUser,
    		page,
    		$currUser,
    		$page
    	});

    	return [$currUser, $page];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
