
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
    function children(element) {
        return Array.from(element.childNodes);
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
            return this.stack++;
        }
    }

    class Board {

        constructor() {

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
        }


        takePiece(piece, currPos, yDiff, nextPos) {

            let isTaken = false;

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

                    if(this.board[xPiece][yPiece] != null) {
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
            }

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

                    let twoSq = (yDiff == 2 || yDiff == -2) && xDiff == 2;

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

                    let twoSq = (yDiff == 2 || yDiff == -2) && xDiff == 2;

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

                let newPiece = new Piece(nextPos.xPos, nextPos.yPos, piece.side, piece.id, piece.stack);

                if(nextPos.xPos == 0 || nextPos.xPos == 7) 
                    newPiece.incrementStack();

                this.board[nextPos.xPos][nextPos.yPos] = newPiece;
                
                let currPos = piece.getPosition(); 

                this.board[currPos.xPos][currPos.yPos] = null;

                moved = true;
            }

            return moved;
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

    /* src/App.svelte generated by Svelte v3.22.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (129:38) 
    function create_if_block_3(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*i*/ ctx[19] % 2 != 0 && /*j*/ ctx[22] % 2 == 0 || /*i*/ ctx[19] % 2 == 0 && /*j*/ ctx[22] % 2 != 0) return create_if_block_4;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_2(ctx);
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(129:38) ",
    		ctx
    	});

    	return block;
    }

    // (122:4) {#if !gameBoard.isEmpty(i, j)}
    function create_if_block(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let show_if;
    	let show_if_1;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (show_if == null || dirty & /*$cirPos, gameBoard*/ 10) show_if = !!(/*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].s == 0);
    		if (show_if) return create_if_block_1;
    		if (show_if_1 == null || dirty & /*$cirPos, gameBoard*/ 10) show_if_1 = !!(/*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].s == 1);
    		if (show_if_1) return create_if_block_2;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(rect, "width", "100");
    			attr_dev(rect, "height", "100");
    			set_style(rect, "fill", "brown");
    			attr_dev(rect, "x", rect_x_value = /*j*/ ctx[22] * /*squareSize*/ ctx[2]);
    			attr_dev(rect, "y", rect_y_value = /*i*/ ctx[19] * /*squareSize*/ ctx[2]);
    			add_location(rect, file, 122, 5, 2540);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*squareSize*/ 4 && rect_x_value !== (rect_x_value = /*j*/ ctx[22] * /*squareSize*/ ctx[2])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*squareSize*/ 4 && rect_y_value !== (rect_y_value = /*i*/ ctx[19] * /*squareSize*/ ctx[2])) {
    				attr_dev(rect, "y", rect_y_value);
    			}

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
    			if (detaching) detach_dev(rect);

    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(122:4) {#if !gameBoard.isEmpty(i, j)}",
    		ctx
    	});

    	return block;
    }

    // (132:5) {:else}
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
    			attr_dev(rect, "x", rect_x_value = /*j*/ ctx[22] * /*squareSize*/ ctx[2]);
    			attr_dev(rect, "y", rect_y_value = /*i*/ ctx[19] * /*squareSize*/ ctx[2]);
    			add_location(rect, file, 132, 6, 3567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*squareSize*/ 4 && rect_x_value !== (rect_x_value = /*j*/ ctx[22] * /*squareSize*/ ctx[2])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*squareSize*/ 4 && rect_y_value !== (rect_y_value = /*i*/ ctx[19] * /*squareSize*/ ctx[2])) {
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
    		source: "(132:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (130:5) {#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}
    function create_if_block_4(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[18](/*i*/ ctx[19], /*j*/ ctx[22], ...args);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "width", "100");
    			attr_dev(rect, "height", "100");
    			set_style(rect, "fill", "brown");
    			attr_dev(rect, "x", rect_x_value = /*j*/ ctx[22] * /*squareSize*/ ctx[2]);
    			attr_dev(rect, "y", rect_y_value = /*i*/ ctx[19] * /*squareSize*/ ctx[2]);
    			add_location(rect, file, 130, 6, 3417);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, rect, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(rect, "click", click_handler_2, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*squareSize*/ 4 && rect_x_value !== (rect_x_value = /*j*/ ctx[22] * /*squareSize*/ ctx[2])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*squareSize*/ 4 && rect_y_value !== (rect_y_value = /*i*/ ctx[19] * /*squareSize*/ ctx[2])) {
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(130:5) {#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}",
    		ctx
    	});

    	return block;
    }

    // (126:53) 
    function create_if_block_2(ctx) {
    	let circle;
    	let circle_id_value;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_stroke_width_value;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[17](/*i*/ ctx[19], /*j*/ ctx[22], ...args);
    	}

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "id", circle_id_value = /*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22]));
    			attr_dev(circle, "class", "checker svelte-ib9c5l");
    			attr_dev(circle, "cx", circle_cx_value = /*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].y);
    			attr_dev(circle, "cy", circle_cy_value = /*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].x);
    			attr_dev(circle, "r", /*$size*/ ctx[4]);
    			attr_dev(circle, "stroke", "white");
    			attr_dev(circle, "stroke-width", circle_stroke_width_value = /*gameBoard*/ ctx[1].getPiece(/*i*/ ctx[19], /*j*/ ctx[22]).stack * 2);
    			attr_dev(circle, "fill", "red");
    			add_location(circle, file, 126, 6, 3020);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, circle, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(circle, "click", click_handler_1, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*gameBoard*/ 2 && circle_id_value !== (circle_id_value = /*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22]))) {
    				attr_dev(circle, "id", circle_id_value);
    			}

    			if (dirty & /*$cirPos, gameBoard*/ 10 && circle_cx_value !== (circle_cx_value = /*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].y)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*$cirPos, gameBoard*/ 10 && circle_cy_value !== (circle_cy_value = /*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].x)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*$size*/ 16) {
    				attr_dev(circle, "r", /*$size*/ ctx[4]);
    			}

    			if (dirty & /*gameBoard*/ 2 && circle_stroke_width_value !== (circle_stroke_width_value = /*gameBoard*/ ctx[1].getPiece(/*i*/ ctx[19], /*j*/ ctx[22]).stack * 2)) {
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
    		source: "(126:53) ",
    		ctx
    	});

    	return block;
    }

    // (124:5) {#if $cirPos[gameBoard.getId(i, j)].s == 0}
    function create_if_block_1(ctx) {
    	let circle;
    	let circle_id_value;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_stroke_width_value;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[16](/*i*/ ctx[19], /*j*/ ctx[22], ...args);
    	}

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "id", circle_id_value = /*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22]));
    			attr_dev(circle, "class", "checker svelte-ib9c5l");
    			attr_dev(circle, "cx", circle_cx_value = /*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].y);
    			attr_dev(circle, "cy", circle_cy_value = /*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].x);
    			attr_dev(circle, "r", /*$size*/ ctx[4]);
    			attr_dev(circle, "stroke", "white");
    			attr_dev(circle, "stroke-width", circle_stroke_width_value = /*gameBoard*/ ctx[1].getPiece(/*i*/ ctx[19], /*j*/ ctx[22]).stack * 2);
    			attr_dev(circle, "fill", "black");
    			add_location(circle, file, 124, 6, 2690);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, circle, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(circle, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*gameBoard*/ 2 && circle_id_value !== (circle_id_value = /*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22]))) {
    				attr_dev(circle, "id", circle_id_value);
    			}

    			if (dirty & /*$cirPos, gameBoard*/ 10 && circle_cx_value !== (circle_cx_value = /*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].y)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*$cirPos, gameBoard*/ 10 && circle_cy_value !== (circle_cy_value = /*$cirPos*/ ctx[3][/*gameBoard*/ ctx[1].getId(/*i*/ ctx[19], /*j*/ ctx[22])].x)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*$size*/ 16) {
    				attr_dev(circle, "r", /*$size*/ ctx[4]);
    			}

    			if (dirty & /*gameBoard*/ 2 && circle_stroke_width_value !== (circle_stroke_width_value = /*gameBoard*/ ctx[1].getPiece(/*i*/ ctx[19], /*j*/ ctx[22]).stack * 2)) {
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(124:5) {#if $cirPos[gameBoard.getId(i, j)].s == 0}",
    		ctx
    	});

    	return block;
    }

    // (121:3) {#each squares as j}
    function create_each_block_1(ctx) {
    	let show_if;
    	let show_if_1;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty & /*gameBoard*/ 2) show_if = !!!/*gameBoard*/ ctx[1].isEmpty(/*i*/ ctx[19], /*j*/ ctx[22]);
    		if (show_if) return create_if_block;
    		if (show_if_1 == null || dirty & /*gameBoard*/ 2) show_if_1 = !!/*gameBoard*/ ctx[1].isEmpty(/*i*/ ctx[19], /*j*/ ctx[22]);
    		if (show_if_1) return create_if_block_3;
    	}

    	let current_block_type = select_block_type(ctx, -1);
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
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
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
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(121:3) {#each squares as j}",
    		ctx
    	});

    	return block;
    }

    // (120:2) {#each squares as i}
    function create_each_block(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*squares*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
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
    			if (dirty & /*gameBoard, squares, $cirPos, $size, setCurrPos, event, squareSize, setNextPos*/ 478) {
    				each_value_1 = /*squares*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(120:2) {#each squares as i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let svg1;
    	let use;
    	let svg0;
    	let each_value = /*squares*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg1 = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			use = svg_element("use");
    			svg0 = svg_element("svg");
    			attr_dev(use, "id", "use");
    			xlink_attr(use, "xlink:href", "#24");
    			add_location(use, file, 137, 2, 3706);
    			attr_dev(svg0, "class", "svelte-ib9c5l");
    			add_location(svg0, file, 138, 1, 3741);
    			attr_dev(svg1, "class", "svelte-ib9c5l");
    			add_location(svg1, file, 118, 1, 2447);
    			attr_dev(div, "id", "board");
    			attr_dev(div, "class", "svelte-ib9c5l");
    			add_location(div, file, 117, 0, 2429);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg1, null);
    			}

    			append_dev(svg1, use);
    			append_dev(svg1, svg0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*squares, gameBoard, $cirPos, $size, setCurrPos, event, squareSize, setNextPos*/ 478) {
    				each_value = /*squares*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg1, use);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	let $cirPos;

    	let $size,
    		$$unsubscribe_size = noop,
    		$$subscribe_size = () => ($$unsubscribe_size(), $$unsubscribe_size = subscribe(size, $$value => $$invalidate(4, $size = $$value)), size);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_size());
    	let currPlayer = 0;
    	let size;
    	validate_store(size, "size");
    	$$subscribe_size();
    	let gameBoard = new Board();
    	const cirPos = spring([]);
    	validate_store(cirPos, "cirPos");
    	component_subscribe($$self, cirPos, value => $$invalidate(3, $cirPos = value));
    	let squares = [0, 1, 2, 3, 4, 5, 6, 7];
    	let currPos = null, nextPos = null;
    	let squareSize, boardHeight, factor;

    	if (screen.width <= 800) {
    		factor = 800 / (screen.width - 12.5);
    		squareSize = Math.floor((screen.width - 10) / 8);
    		if (screen.width >= 500) $$subscribe_size(size = spring(25)); else $$subscribe_size(size = spring(12.5));
    		boardHeight = squareSize * 8;
    	} else {
    		factor = 1;
    		$$subscribe_size(size = spring(40));
    		squareSize = 100;
    		boardHeight = squareSize * 8;
    	}

    	document.documentElement.style.setProperty("--board-height", boardHeight + "px");
    	setCirclePositions();

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
    		if ($cirPos[gameBoard.getId(i, j)].s == currPlayer) {
    			console.log(gameBoard.getPiece(i, j).stack);
    			let newtarget = evt.target || event.target;
    			let topmost = document.getElementById("use");
    			topmost.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + newtarget.id);
    			currPos = gameBoard.getPiece(i, j);
    		}
    	} //let pos = currPos.getPosition();
    	//console.log(pos.xPos + ", " + pos.yPos);

    	function setNextPos(i, j) {
    		if (gameBoard.isEmpty(i, j) && currPos != null) {
    			nextPos = new Position(i, j, "E");
    			let move = gameBoard.doMove(currPos, nextPos);
    			console.log(gameBoard);
    			$$invalidate(1, gameBoard);

    			if (move) {
    				updateCirclePositions(nextPos);
    			}

    			currPlayer = currPlayer == 0 ? 1 : 0;
    			(currPos = null, nextPos = null);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	const click_handler = (i, j) => setCurrPos(i, j, event);
    	const click_handler_1 = (i, j) => setCurrPos(i, j, event);
    	const click_handler_2 = (i, j) => setNextPos(i, j);

    	$$self.$capture_state = () => ({
    		Position,
    		Board,
    		spring,
    		writable,
    		currPlayer,
    		size,
    		gameBoard,
    		cirPos,
    		squares,
    		currPos,
    		nextPos,
    		squareSize,
    		boardHeight,
    		factor,
    		updateCirclePositions,
    		setCirclePositions,
    		setCurrPos,
    		setNextPos,
    		$cirPos,
    		$size
    	});

    	$$self.$inject_state = $$props => {
    		if ("currPlayer" in $$props) currPlayer = $$props.currPlayer;
    		if ("size" in $$props) $$subscribe_size($$invalidate(0, size = $$props.size));
    		if ("gameBoard" in $$props) $$invalidate(1, gameBoard = $$props.gameBoard);
    		if ("squares" in $$props) $$invalidate(6, squares = $$props.squares);
    		if ("currPos" in $$props) currPos = $$props.currPos;
    		if ("nextPos" in $$props) nextPos = $$props.nextPos;
    		if ("squareSize" in $$props) $$invalidate(2, squareSize = $$props.squareSize);
    		if ("boardHeight" in $$props) boardHeight = $$props.boardHeight;
    		if ("factor" in $$props) factor = $$props.factor;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		gameBoard,
    		squareSize,
    		$cirPos,
    		$size,
    		cirPos,
    		squares,
    		setCurrPos,
    		setNextPos,
    		currPlayer,
    		currPos,
    		nextPos,
    		boardHeight,
    		factor,
    		updateCirclePositions,
    		setCirclePositions,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
