
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.3' }, detail)));
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
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
            this.positon = new Position(xPos, yPos);
        }

        incrementStack() {
            this.stack = 2;
        }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
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

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    function getCjsExportFromNamespace (n) {
    	return n && n['default'] || n;
    }

    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */

    var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    var parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];

    var parseuri = function parseuri(str) {
        var src = str,
            b = str.indexOf('['),
            e = str.indexOf(']');

        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }

        var m = re.exec(str || ''),
            uri = {},
            i = 14;

        while (i--) {
            uri[parts[i]] = m[i] || '';
        }

        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }

        return uri;
    };

    /**
     * Helpers.
     */

    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} [options]
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    var ms = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse(val);
      } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val)
      );
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'weeks':
        case 'week':
        case 'w':
          return n * w;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + 's';
      }
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
      }
      return ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
    }

    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     */

    function setup(env) {
    	createDebug.debug = createDebug;
    	createDebug.default = createDebug;
    	createDebug.coerce = coerce;
    	createDebug.disable = disable;
    	createDebug.enable = enable;
    	createDebug.enabled = enabled;
    	createDebug.humanize = ms;

    	Object.keys(env).forEach(key => {
    		createDebug[key] = env[key];
    	});

    	/**
    	* Active `debug` instances.
    	*/
    	createDebug.instances = [];

    	/**
    	* The currently active debug mode names, and names to skip.
    	*/

    	createDebug.names = [];
    	createDebug.skips = [];

    	/**
    	* Map of special "%n" handling functions, for the debug "format" argument.
    	*
    	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
    	*/
    	createDebug.formatters = {};

    	/**
    	* Selects a color for a debug namespace
    	* @param {String} namespace The namespace string for the for the debug instance to be colored
    	* @return {Number|String} An ANSI color code for the given namespace
    	* @api private
    	*/
    	function selectColor(namespace) {
    		let hash = 0;

    		for (let i = 0; i < namespace.length; i++) {
    			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
    			hash |= 0; // Convert to 32bit integer
    		}

    		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    	}
    	createDebug.selectColor = selectColor;

    	/**
    	* Create a debugger with the given `namespace`.
    	*
    	* @param {String} namespace
    	* @return {Function}
    	* @api public
    	*/
    	function createDebug(namespace) {
    		let prevTime;

    		function debug(...args) {
    			// Disabled?
    			if (!debug.enabled) {
    				return;
    			}

    			const self = debug;

    			// Set `diff` timestamp
    			const curr = Number(new Date());
    			const ms = curr - (prevTime || curr);
    			self.diff = ms;
    			self.prev = prevTime;
    			self.curr = curr;
    			prevTime = curr;

    			args[0] = createDebug.coerce(args[0]);

    			if (typeof args[0] !== 'string') {
    				// Anything else let's inspect with %O
    				args.unshift('%O');
    			}

    			// Apply any `formatters` transformations
    			let index = 0;
    			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
    				// If we encounter an escaped % then don't increase the array index
    				if (match === '%%') {
    					return match;
    				}
    				index++;
    				const formatter = createDebug.formatters[format];
    				if (typeof formatter === 'function') {
    					const val = args[index];
    					match = formatter.call(self, val);

    					// Now we need to remove `args[index]` since it's inlined in the `format`
    					args.splice(index, 1);
    					index--;
    				}
    				return match;
    			});

    			// Apply env-specific formatting (colors, etc.)
    			createDebug.formatArgs.call(self, args);

    			const logFn = self.log || createDebug.log;
    			logFn.apply(self, args);
    		}

    		debug.namespace = namespace;
    		debug.enabled = createDebug.enabled(namespace);
    		debug.useColors = createDebug.useColors();
    		debug.color = selectColor(namespace);
    		debug.destroy = destroy;
    		debug.extend = extend;
    		// Debug.formatArgs = formatArgs;
    		// debug.rawLog = rawLog;

    		// env-specific initialization logic for debug instances
    		if (typeof createDebug.init === 'function') {
    			createDebug.init(debug);
    		}

    		createDebug.instances.push(debug);

    		return debug;
    	}

    	function destroy() {
    		const index = createDebug.instances.indexOf(this);
    		if (index !== -1) {
    			createDebug.instances.splice(index, 1);
    			return true;
    		}
    		return false;
    	}

    	function extend(namespace, delimiter) {
    		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    		newDebug.log = this.log;
    		return newDebug;
    	}

    	/**
    	* Enables a debug mode by namespaces. This can include modes
    	* separated by a colon and wildcards.
    	*
    	* @param {String} namespaces
    	* @api public
    	*/
    	function enable(namespaces) {
    		createDebug.save(namespaces);

    		createDebug.names = [];
    		createDebug.skips = [];

    		let i;
    		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    		const len = split.length;

    		for (i = 0; i < len; i++) {
    			if (!split[i]) {
    				// ignore empty strings
    				continue;
    			}

    			namespaces = split[i].replace(/\*/g, '.*?');

    			if (namespaces[0] === '-') {
    				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    			} else {
    				createDebug.names.push(new RegExp('^' + namespaces + '$'));
    			}
    		}

    		for (i = 0; i < createDebug.instances.length; i++) {
    			const instance = createDebug.instances[i];
    			instance.enabled = createDebug.enabled(instance.namespace);
    		}
    	}

    	/**
    	* Disable debug output.
    	*
    	* @return {String} namespaces
    	* @api public
    	*/
    	function disable() {
    		const namespaces = [
    			...createDebug.names.map(toNamespace),
    			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
    		].join(',');
    		createDebug.enable('');
    		return namespaces;
    	}

    	/**
    	* Returns true if the given mode name is enabled, false otherwise.
    	*
    	* @param {String} name
    	* @return {Boolean}
    	* @api public
    	*/
    	function enabled(name) {
    		if (name[name.length - 1] === '*') {
    			return true;
    		}

    		let i;
    		let len;

    		for (i = 0, len = createDebug.skips.length; i < len; i++) {
    			if (createDebug.skips[i].test(name)) {
    				return false;
    			}
    		}

    		for (i = 0, len = createDebug.names.length; i < len; i++) {
    			if (createDebug.names[i].test(name)) {
    				return true;
    			}
    		}

    		return false;
    	}

    	/**
    	* Convert regexp to namespace
    	*
    	* @param {RegExp} regxep
    	* @return {String} namespace
    	* @api private
    	*/
    	function toNamespace(regexp) {
    		return regexp.toString()
    			.substring(2, regexp.toString().length - 2)
    			.replace(/\.\*\?$/, '*');
    	}

    	/**
    	* Coerce `val`.
    	*
    	* @param {Mixed} val
    	* @return {Mixed}
    	* @api private
    	*/
    	function coerce(val) {
    		if (val instanceof Error) {
    			return val.stack || val.message;
    		}
    		return val;
    	}

    	createDebug.enable(createDebug.load());

    	return createDebug;
    }

    var common = setup;

    var browser = createCommonjsModule(function (module, exports) {
    /* eslint-env browser */

    /**
     * This is the web browser implementation of `debug()`.
     */

    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();

    /**
     * Colors.
     */

    exports.colors = [
    	'#0000CC',
    	'#0000FF',
    	'#0033CC',
    	'#0033FF',
    	'#0066CC',
    	'#0066FF',
    	'#0099CC',
    	'#0099FF',
    	'#00CC00',
    	'#00CC33',
    	'#00CC66',
    	'#00CC99',
    	'#00CCCC',
    	'#00CCFF',
    	'#3300CC',
    	'#3300FF',
    	'#3333CC',
    	'#3333FF',
    	'#3366CC',
    	'#3366FF',
    	'#3399CC',
    	'#3399FF',
    	'#33CC00',
    	'#33CC33',
    	'#33CC66',
    	'#33CC99',
    	'#33CCCC',
    	'#33CCFF',
    	'#6600CC',
    	'#6600FF',
    	'#6633CC',
    	'#6633FF',
    	'#66CC00',
    	'#66CC33',
    	'#9900CC',
    	'#9900FF',
    	'#9933CC',
    	'#9933FF',
    	'#99CC00',
    	'#99CC33',
    	'#CC0000',
    	'#CC0033',
    	'#CC0066',
    	'#CC0099',
    	'#CC00CC',
    	'#CC00FF',
    	'#CC3300',
    	'#CC3333',
    	'#CC3366',
    	'#CC3399',
    	'#CC33CC',
    	'#CC33FF',
    	'#CC6600',
    	'#CC6633',
    	'#CC9900',
    	'#CC9933',
    	'#CCCC00',
    	'#CCCC33',
    	'#FF0000',
    	'#FF0033',
    	'#FF0066',
    	'#FF0099',
    	'#FF00CC',
    	'#FF00FF',
    	'#FF3300',
    	'#FF3333',
    	'#FF3366',
    	'#FF3399',
    	'#FF33CC',
    	'#FF33FF',
    	'#FF6600',
    	'#FF6633',
    	'#FF9900',
    	'#FF9933',
    	'#FFCC00',
    	'#FFCC33'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    // eslint-disable-next-line complexity
    function useColors() {
    	// NB: In an Electron preload script, document will be defined but not fully
    	// initialized. Since we know we're in Chrome, we'll just detect this case
    	// explicitly
    	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    		return true;
    	}

    	// Internet Explorer and Edge do not support colors.
    	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    		return false;
    	}

    	// Is webkit? http://stackoverflow.com/a/16459606/376773
    	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    		// Is firebug? http://stackoverflow.com/a/398120/376773
    		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    		// Is firefox >= v31?
    		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    		// Double check webkit in userAgent just in case we are in a worker
    		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
    	args[0] = (this.useColors ? '%c' : '') +
    		this.namespace +
    		(this.useColors ? ' %c' : ' ') +
    		args[0] +
    		(this.useColors ? '%c ' : ' ') +
    		'+' + module.exports.humanize(this.diff);

    	if (!this.useColors) {
    		return;
    	}

    	const c = 'color: ' + this.color;
    	args.splice(1, 0, c, 'color: inherit');

    	// The final "%c" is somewhat tricky, because there could be other
    	// arguments passed either before or after the %c, so we need to
    	// figure out the correct index to insert the CSS into
    	let index = 0;
    	let lastC = 0;
    	args[0].replace(/%[a-zA-Z%]/g, match => {
    		if (match === '%%') {
    			return;
    		}
    		index++;
    		if (match === '%c') {
    			// We only are interested in the *last* %c
    			// (the user may have provided their own)
    			lastC = index;
    		}
    	});

    	args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */
    function log(...args) {
    	// This hackery is required for IE8/9, where
    	// the `console.log` function doesn't have 'apply'
    	return typeof console === 'object' &&
    		console.log &&
    		console.log(...args);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */
    function save(namespaces) {
    	try {
    		if (namespaces) {
    			exports.storage.setItem('debug', namespaces);
    		} else {
    			exports.storage.removeItem('debug');
    		}
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */
    function load() {
    	let r;
    	try {
    		r = exports.storage.getItem('debug');
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}

    	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    	if (!r && typeof process !== 'undefined' && 'env' in process) {
    		r = process.env.DEBUG;
    	}

    	return r;
    }

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
    	try {
    		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    		// The Browser also has localStorage in the global context.
    		return localStorage;
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}
    }

    module.exports = common(exports);

    const {formatters} = module.exports;

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    formatters.j = function (v) {
    	try {
    		return JSON.stringify(v);
    	} catch (error) {
    		return '[UnexpectedJSONParseError]: ' + error.message;
    	}
    };
    });
    var browser_1 = browser.log;
    var browser_2 = browser.formatArgs;
    var browser_3 = browser.save;
    var browser_4 = browser.load;
    var browser_5 = browser.useColors;
    var browser_6 = browser.storage;
    var browser_7 = browser.colors;

    /**
     * Module dependencies.
     */


    var debug = browser('socket.io-client:url');

    /**
     * Module exports.
     */

    var url_1 = url;

    /**
     * URL parser.
     *
     * @param {String} url
     * @param {Object} An object meant to mimic window.location.
     *                 Defaults to window.location.
     * @api public
     */

    function url (uri, loc) {
      var obj = uri;

      // default to window.location
      loc = loc || (typeof location !== 'undefined' && location);
      if (null == uri) uri = loc.protocol + '//' + loc.host;

      // relative path support
      if ('string' === typeof uri) {
        if ('/' === uri.charAt(0)) {
          if ('/' === uri.charAt(1)) {
            uri = loc.protocol + uri;
          } else {
            uri = loc.host + uri;
          }
        }

        if (!/^(https?|wss?):\/\//.test(uri)) {
          debug('protocol-less url %s', uri);
          if ('undefined' !== typeof loc) {
            uri = loc.protocol + '//' + uri;
          } else {
            uri = 'https://' + uri;
          }
        }

        // parse
        debug('parse %s', uri);
        obj = parseuri(uri);
      }

      // make sure we treat `localhost:80` and `localhost` equally
      if (!obj.port) {
        if (/^(http|ws)$/.test(obj.protocol)) {
          obj.port = '80';
        } else if (/^(http|ws)s$/.test(obj.protocol)) {
          obj.port = '443';
        }
      }

      obj.path = obj.path || '/';

      var ipv6 = obj.host.indexOf(':') !== -1;
      var host = ipv6 ? '[' + obj.host + ']' : obj.host;

      // define unique id
      obj.id = obj.protocol + '://' + host + ':' + obj.port;
      // define href
      obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

      return obj;
    }

    /**
     * Helpers.
     */

    var s$1 = 1000;
    var m$1 = s$1 * 60;
    var h$1 = m$1 * 60;
    var d$1 = h$1 * 24;
    var y$1 = d$1 * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} [options]
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    var ms$1 = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse$1(val);
      } else if (type === 'number' && isNaN(val) === false) {
        return options.long ? fmtLong$1(val) : fmtShort$1(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val)
      );
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse$1(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y$1;
        case 'days':
        case 'day':
        case 'd':
          return n * d$1;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h$1;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m$1;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s$1;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort$1(ms) {
      if (ms >= d$1) {
        return Math.round(ms / d$1) + 'd';
      }
      if (ms >= h$1) {
        return Math.round(ms / h$1) + 'h';
      }
      if (ms >= m$1) {
        return Math.round(ms / m$1) + 'm';
      }
      if (ms >= s$1) {
        return Math.round(ms / s$1) + 's';
      }
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong$1(ms) {
      return plural$1(ms, d$1, 'day') ||
        plural$1(ms, h$1, 'hour') ||
        plural$1(ms, m$1, 'minute') ||
        plural$1(ms, s$1, 'second') ||
        ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural$1(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + ' ' + name;
      }
      return Math.ceil(ms / n) + ' ' + name + 's';
    }

    var debug$1 = createCommonjsModule(function (module, exports) {
    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = ms$1;

    /**
     * Active `debug` instances.
     */
    exports.instances = [];

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
     */

    exports.formatters = {};

    /**
     * Select a color.
     * @param {String} namespace
     * @return {Number}
     * @api private
     */

    function selectColor(namespace) {
      var hash = 0, i;

      for (i in namespace) {
        hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }

      return exports.colors[Math.abs(hash) % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function createDebug(namespace) {

      var prevTime;

      function debug() {
        // disabled?
        if (!debug.enabled) return;

        var self = debug;

        // set `diff` timestamp
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // turn the `arguments` into a proper Array
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %O
          args.unshift('%O');
        }

        // apply any `formatters` transformations
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        // apply env-specific formatting (colors, etc.)
        exports.formatArgs.call(self, args);

        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);
      debug.destroy = destroy;

      // env-specific initialization logic for debug instances
      if ('function' === typeof exports.init) {
        exports.init(debug);
      }

      exports.instances.push(debug);

      return debug;
    }

    function destroy () {
      var index = exports.instances.indexOf(this);
      if (index !== -1) {
        exports.instances.splice(index, 1);
        return true;
      } else {
        return false;
      }
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      exports.save(namespaces);

      exports.names = [];
      exports.skips = [];

      var i;
      var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
      var len = split.length;

      for (i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }

      for (i = 0; i < exports.instances.length; i++) {
        var instance = exports.instances[i];
        instance.enabled = exports.enabled(instance.namespace);
      }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
      exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      if (name[name.length - 1] === '*') {
        return true;
      }
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
    });
    var debug_1 = debug$1.coerce;
    var debug_2 = debug$1.disable;
    var debug_3 = debug$1.enable;
    var debug_4 = debug$1.enabled;
    var debug_5 = debug$1.humanize;
    var debug_6 = debug$1.instances;
    var debug_7 = debug$1.names;
    var debug_8 = debug$1.skips;
    var debug_9 = debug$1.formatters;

    var browser$1 = createCommonjsModule(function (module, exports) {
    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = debug$1;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = 'undefined' != typeof chrome
                   && 'undefined' != typeof chrome.storage
                      ? chrome.storage.local
                      : localstorage();

    /**
     * Colors.
     */

    exports.colors = [
      '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
      '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
      '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
      '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
      '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
      '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
      '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
      '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
      '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
      '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
      '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
      // NB: In an Electron preload script, document will be defined but not fully
      // initialized. Since we know we're in Chrome, we'll just detect this case
      // explicitly
      if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
        return true;
      }

      // Internet Explorer and Edge do not support colors.
      if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }

      // is webkit? http://stackoverflow.com/a/16459606/376773
      // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
      return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
        // is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
        // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
        // double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return '[UnexpectedJSONParseError]: ' + err.message;
      }
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
      var useColors = this.useColors;

      args[0] = (useColors ? '%c' : '')
        + this.namespace
        + (useColors ? ' %c' : ' ')
        + args[0]
        + (useColors ? '%c ' : ' ')
        + '+' + exports.humanize(this.diff);

      if (!useColors) return;

      var c = 'color: ' + this.color;
      args.splice(1, 0, c, 'color: inherit');

      // the final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
          // we only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });

      args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
      // this hackery is required for IE8/9, where
      // the `console.log` function doesn't have 'apply'
      return 'object' === typeof console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem('debug');
        } else {
          exports.storage.debug = namespaces;
        }
      } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch(e) {}

      // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
      if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
      }

      return r;
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {}
    }
    });
    var browser_1$1 = browser$1.log;
    var browser_2$1 = browser$1.formatArgs;
    var browser_3$1 = browser$1.save;
    var browser_4$1 = browser$1.load;
    var browser_5$1 = browser$1.useColors;
    var browser_6$1 = browser$1.storage;
    var browser_7$1 = browser$1.colors;

    var componentEmitter = createCommonjsModule(function (module) {
    /**
     * Expose `Emitter`.
     */

    {
      module.exports = Emitter;
    }

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }
    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};
      var args = [].slice.call(arguments, 1)
        , callbacks = this._callbacks['$' + event];

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };
    });

    var toString = {}.toString;

    var isarray = Array.isArray || function (arr) {
      return toString.call(arr) == '[object Array]';
    };

    var isBuffer = isBuf;

    var withNativeBuffer = typeof Buffer === 'function' && typeof Buffer.isBuffer === 'function';
    var withNativeArrayBuffer = typeof ArrayBuffer === 'function';

    var isView = function (obj) {
      return typeof ArrayBuffer.isView === 'function' ? ArrayBuffer.isView(obj) : (obj.buffer instanceof ArrayBuffer);
    };

    /**
     * Returns true if obj is a buffer or an arraybuffer.
     *
     * @api private
     */

    function isBuf(obj) {
      return (withNativeBuffer && Buffer.isBuffer(obj)) ||
              (withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)));
    }

    /*global Blob,File*/

    /**
     * Module requirements
     */



    var toString$1 = Object.prototype.toString;
    var withNativeBlob = typeof Blob === 'function' || (typeof Blob !== 'undefined' && toString$1.call(Blob) === '[object BlobConstructor]');
    var withNativeFile = typeof File === 'function' || (typeof File !== 'undefined' && toString$1.call(File) === '[object FileConstructor]');

    /**
     * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
     * Anything with blobs or files should be fed through removeBlobs before coming
     * here.
     *
     * @param {Object} packet - socket.io event packet
     * @return {Object} with deconstructed packet and list of buffers
     * @api public
     */

    var deconstructPacket = function(packet) {
      var buffers = [];
      var packetData = packet.data;
      var pack = packet;
      pack.data = _deconstructPacket(packetData, buffers);
      pack.attachments = buffers.length; // number of binary 'attachments'
      return {packet: pack, buffers: buffers};
    };

    function _deconstructPacket(data, buffers) {
      if (!data) return data;

      if (isBuffer(data)) {
        var placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
      } else if (isarray(data)) {
        var newData = new Array(data.length);
        for (var i = 0; i < data.length; i++) {
          newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
      } else if (typeof data === 'object' && !(data instanceof Date)) {
        var newData = {};
        for (var key in data) {
          newData[key] = _deconstructPacket(data[key], buffers);
        }
        return newData;
      }
      return data;
    }

    /**
     * Reconstructs a binary packet from its placeholder packet and buffers
     *
     * @param {Object} packet - event packet with placeholders
     * @param {Array} buffers - binary buffers to put in placeholder positions
     * @return {Object} reconstructed packet
     * @api public
     */

    var reconstructPacket = function(packet, buffers) {
      packet.data = _reconstructPacket(packet.data, buffers);
      packet.attachments = undefined; // no longer useful
      return packet;
    };

    function _reconstructPacket(data, buffers) {
      if (!data) return data;

      if (data && data._placeholder) {
        return buffers[data.num]; // appropriate buffer (should be natural order anyway)
      } else if (isarray(data)) {
        for (var i = 0; i < data.length; i++) {
          data[i] = _reconstructPacket(data[i], buffers);
        }
      } else if (typeof data === 'object') {
        for (var key in data) {
          data[key] = _reconstructPacket(data[key], buffers);
        }
      }

      return data;
    }

    /**
     * Asynchronously removes Blobs or Files from data via
     * FileReader's readAsArrayBuffer method. Used before encoding
     * data as msgpack. Calls callback with the blobless data.
     *
     * @param {Object} data
     * @param {Function} callback
     * @api private
     */

    var removeBlobs = function(data, callback) {
      function _removeBlobs(obj, curKey, containingObject) {
        if (!obj) return obj;

        // convert any blob
        if ((withNativeBlob && obj instanceof Blob) ||
            (withNativeFile && obj instanceof File)) {
          pendingBlobs++;

          // async filereader
          var fileReader = new FileReader();
          fileReader.onload = function() { // this.result == arraybuffer
            if (containingObject) {
              containingObject[curKey] = this.result;
            }
            else {
              bloblessData = this.result;
            }

            // if nothing pending its callback time
            if(! --pendingBlobs) {
              callback(bloblessData);
            }
          };

          fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
        } else if (isarray(obj)) { // handle array
          for (var i = 0; i < obj.length; i++) {
            _removeBlobs(obj[i], i, obj);
          }
        } else if (typeof obj === 'object' && !isBuffer(obj)) { // and object
          for (var key in obj) {
            _removeBlobs(obj[key], key, obj);
          }
        }
      }

      var pendingBlobs = 0;
      var bloblessData = data;
      _removeBlobs(bloblessData);
      if (!pendingBlobs) {
        callback(bloblessData);
      }
    };

    var binary = {
    	deconstructPacket: deconstructPacket,
    	reconstructPacket: reconstructPacket,
    	removeBlobs: removeBlobs
    };

    var socket_ioParser = createCommonjsModule(function (module, exports) {
    /**
     * Module dependencies.
     */

    var debug = browser$1('socket.io-parser');





    /**
     * Protocol version.
     *
     * @api public
     */

    exports.protocol = 4;

    /**
     * Packet types.
     *
     * @api public
     */

    exports.types = [
      'CONNECT',
      'DISCONNECT',
      'EVENT',
      'ACK',
      'ERROR',
      'BINARY_EVENT',
      'BINARY_ACK'
    ];

    /**
     * Packet type `connect`.
     *
     * @api public
     */

    exports.CONNECT = 0;

    /**
     * Packet type `disconnect`.
     *
     * @api public
     */

    exports.DISCONNECT = 1;

    /**
     * Packet type `event`.
     *
     * @api public
     */

    exports.EVENT = 2;

    /**
     * Packet type `ack`.
     *
     * @api public
     */

    exports.ACK = 3;

    /**
     * Packet type `error`.
     *
     * @api public
     */

    exports.ERROR = 4;

    /**
     * Packet type 'binary event'
     *
     * @api public
     */

    exports.BINARY_EVENT = 5;

    /**
     * Packet type `binary ack`. For acks with binary arguments.
     *
     * @api public
     */

    exports.BINARY_ACK = 6;

    /**
     * Encoder constructor.
     *
     * @api public
     */

    exports.Encoder = Encoder;

    /**
     * Decoder constructor.
     *
     * @api public
     */

    exports.Decoder = Decoder;

    /**
     * A socket.io Encoder instance
     *
     * @api public
     */

    function Encoder() {}

    var ERROR_PACKET = exports.ERROR + '"encode error"';

    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     * @param {Function} callback - function to handle encodings (likely engine.write)
     * @return Calls callback with Array of encodings
     * @api public
     */

    Encoder.prototype.encode = function(obj, callback){
      debug('encoding packet %j', obj);

      if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
        encodeAsBinary(obj, callback);
      } else {
        var encoding = encodeAsString(obj);
        callback([encoding]);
      }
    };

    /**
     * Encode packet as string.
     *
     * @param {Object} packet
     * @return {String} encoded
     * @api private
     */

    function encodeAsString(obj) {

      // first is type
      var str = '' + obj.type;

      // attachments if we have them
      if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
        str += obj.attachments + '-';
      }

      // if we have a namespace other than `/`
      // we append it followed by a comma `,`
      if (obj.nsp && '/' !== obj.nsp) {
        str += obj.nsp + ',';
      }

      // immediately followed by the id
      if (null != obj.id) {
        str += obj.id;
      }

      // json data
      if (null != obj.data) {
        var payload = tryStringify(obj.data);
        if (payload !== false) {
          str += payload;
        } else {
          return ERROR_PACKET;
        }
      }

      debug('encoded %j as %s', obj, str);
      return str;
    }

    function tryStringify(str) {
      try {
        return JSON.stringify(str);
      } catch(e){
        return false;
      }
    }

    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     *
     * @param {Object} packet
     * @return {Buffer} encoded
     * @api private
     */

    function encodeAsBinary(obj, callback) {

      function writeEncoding(bloblessData) {
        var deconstruction = binary.deconstructPacket(bloblessData);
        var pack = encodeAsString(deconstruction.packet);
        var buffers = deconstruction.buffers;

        buffers.unshift(pack); // add packet info to beginning of data list
        callback(buffers); // write all the buffers
      }

      binary.removeBlobs(obj, writeEncoding);
    }

    /**
     * A socket.io Decoder instance
     *
     * @return {Object} decoder
     * @api public
     */

    function Decoder() {
      this.reconstructor = null;
    }

    /**
     * Mix in `Emitter` with Decoder.
     */

    componentEmitter(Decoder.prototype);

    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     * @return {Object} packet
     * @api public
     */

    Decoder.prototype.add = function(obj) {
      var packet;
      if (typeof obj === 'string') {
        packet = decodeString(obj);
        if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
          this.reconstructor = new BinaryReconstructor(packet);

          // no attachments, labeled binary but no binary data to follow
          if (this.reconstructor.reconPack.attachments === 0) {
            this.emit('decoded', packet);
          }
        } else { // non-binary full packet
          this.emit('decoded', packet);
        }
      } else if (isBuffer(obj) || obj.base64) { // raw binary data
        if (!this.reconstructor) {
          throw new Error('got binary data when not reconstructing a packet');
        } else {
          packet = this.reconstructor.takeBinaryData(obj);
          if (packet) { // received final buffer
            this.reconstructor = null;
            this.emit('decoded', packet);
          }
        }
      } else {
        throw new Error('Unknown type: ' + obj);
      }
    };

    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     * @api private
     */

    function decodeString(str) {
      var i = 0;
      // look up type
      var p = {
        type: Number(str.charAt(0))
      };

      if (null == exports.types[p.type]) {
        return error('unknown packet type ' + p.type);
      }

      // look up attachments if type binary
      if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
        var buf = '';
        while (str.charAt(++i) !== '-') {
          buf += str.charAt(i);
          if (i == str.length) break;
        }
        if (buf != Number(buf) || str.charAt(i) !== '-') {
          throw new Error('Illegal attachments');
        }
        p.attachments = Number(buf);
      }

      // look up namespace (if any)
      if ('/' === str.charAt(i + 1)) {
        p.nsp = '';
        while (++i) {
          var c = str.charAt(i);
          if (',' === c) break;
          p.nsp += c;
          if (i === str.length) break;
        }
      } else {
        p.nsp = '/';
      }

      // look up id
      var next = str.charAt(i + 1);
      if ('' !== next && Number(next) == next) {
        p.id = '';
        while (++i) {
          var c = str.charAt(i);
          if (null == c || Number(c) != c) {
            --i;
            break;
          }
          p.id += str.charAt(i);
          if (i === str.length) break;
        }
        p.id = Number(p.id);
      }

      // look up json data
      if (str.charAt(++i)) {
        var payload = tryParse(str.substr(i));
        var isPayloadValid = payload !== false && (p.type === exports.ERROR || isarray(payload));
        if (isPayloadValid) {
          p.data = payload;
        } else {
          return error('invalid payload');
        }
      }

      debug('decoded %s as %j', str, p);
      return p;
    }

    function tryParse(str) {
      try {
        return JSON.parse(str);
      } catch(e){
        return false;
      }
    }

    /**
     * Deallocates a parser's resources
     *
     * @api public
     */

    Decoder.prototype.destroy = function() {
      if (this.reconstructor) {
        this.reconstructor.finishedReconstruction();
      }
    };

    /**
     * A manager of a binary event's 'buffer sequence'. Should
     * be constructed whenever a packet of type BINARY_EVENT is
     * decoded.
     *
     * @param {Object} packet
     * @return {BinaryReconstructor} initialized reconstructor
     * @api private
     */

    function BinaryReconstructor(packet) {
      this.reconPack = packet;
      this.buffers = [];
    }

    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     * @api private
     */

    BinaryReconstructor.prototype.takeBinaryData = function(binData) {
      this.buffers.push(binData);
      if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
        var packet = binary.reconstructPacket(this.reconPack, this.buffers);
        this.finishedReconstruction();
        return packet;
      }
      return null;
    };

    /**
     * Cleans up binary packet reconstruction variables.
     *
     * @api private
     */

    BinaryReconstructor.prototype.finishedReconstruction = function() {
      this.reconPack = null;
      this.buffers = [];
    };

    function error(msg) {
      return {
        type: exports.ERROR,
        data: 'parser error: ' + msg
      };
    }
    });
    var socket_ioParser_1 = socket_ioParser.protocol;
    var socket_ioParser_2 = socket_ioParser.types;
    var socket_ioParser_3 = socket_ioParser.CONNECT;
    var socket_ioParser_4 = socket_ioParser.DISCONNECT;
    var socket_ioParser_5 = socket_ioParser.EVENT;
    var socket_ioParser_6 = socket_ioParser.ACK;
    var socket_ioParser_7 = socket_ioParser.ERROR;
    var socket_ioParser_8 = socket_ioParser.BINARY_EVENT;
    var socket_ioParser_9 = socket_ioParser.BINARY_ACK;
    var socket_ioParser_10 = socket_ioParser.Encoder;
    var socket_ioParser_11 = socket_ioParser.Decoder;

    var hasCors = createCommonjsModule(function (module) {
    /**
     * Module exports.
     *
     * Logic borrowed from Modernizr:
     *
     *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
     */

    try {
      module.exports = typeof XMLHttpRequest !== 'undefined' &&
        'withCredentials' in new XMLHttpRequest();
    } catch (err) {
      // if XMLHttp support is disabled in IE then it will throw
      // when trying to create
      module.exports = false;
    }
    });

    var globalThis_browser = (function () {
      if (typeof self !== 'undefined') {
        return self;
      } else if (typeof window !== 'undefined') {
        return window;
      } else {
        return Function('return this')(); // eslint-disable-line no-new-func
      }
    })();

    // browser shim for xmlhttprequest module




    var xmlhttprequest = function (opts) {
      var xdomain = opts.xdomain;

      // scheme must be same when usign XDomainRequest
      // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
      var xscheme = opts.xscheme;

      // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
      // https://github.com/Automattic/engine.io-client/pull/217
      var enablesXDR = opts.enablesXDR;

      // XMLHttpRequest can be disabled on IE
      try {
        if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCors)) {
          return new XMLHttpRequest();
        }
      } catch (e) { }

      // Use XDomainRequest for IE8 if enablesXDR is true
      // because loading bar keeps flashing when using jsonp-polling
      // https://github.com/yujiosaka/socke.io-ie8-loading-example
      try {
        if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
          return new XDomainRequest();
        }
      } catch (e) { }

      if (!xdomain) {
        try {
          return new globalThis_browser[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
        } catch (e) { }
      }
    };

    /**
     * Gets the keys for an object.
     *
     * @return {Array} keys
     * @api private
     */

    var keys = Object.keys || function keys (obj){
      var arr = [];
      var has = Object.prototype.hasOwnProperty;

      for (var i in obj) {
        if (has.call(obj, i)) {
          arr.push(i);
        }
      }
      return arr;
    };

    /* global Blob File */

    /*
     * Module requirements.
     */



    var toString$2 = Object.prototype.toString;
    var withNativeBlob$1 = typeof Blob === 'function' ||
                            typeof Blob !== 'undefined' && toString$2.call(Blob) === '[object BlobConstructor]';
    var withNativeFile$1 = typeof File === 'function' ||
                            typeof File !== 'undefined' && toString$2.call(File) === '[object FileConstructor]';

    /**
     * Module exports.
     */

    var hasBinary2 = hasBinary;

    /**
     * Checks for binary data.
     *
     * Supports Buffer, ArrayBuffer, Blob and File.
     *
     * @param {Object} anything
     * @api public
     */

    function hasBinary (obj) {
      if (!obj || typeof obj !== 'object') {
        return false;
      }

      if (isarray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (hasBinary(obj[i])) {
            return true;
          }
        }
        return false;
      }

      if ((typeof Buffer === 'function' && Buffer.isBuffer && Buffer.isBuffer(obj)) ||
        (typeof ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
        (withNativeBlob$1 && obj instanceof Blob) ||
        (withNativeFile$1 && obj instanceof File)
      ) {
        return true;
      }

      // see: https://github.com/Automattic/has-binary/pull/4
      if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
          return true;
        }
      }

      return false;
    }

    /**
     * An abstraction for slicing an arraybuffer even when
     * ArrayBuffer.prototype.slice is not supported
     *
     * @api public
     */

    var arraybuffer_slice = function(arraybuffer, start, end) {
      var bytes = arraybuffer.byteLength;
      start = start || 0;
      end = end || bytes;

      if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

      if (start < 0) { start += bytes; }
      if (end < 0) { end += bytes; }
      if (end > bytes) { end = bytes; }

      if (start >= bytes || start >= end || bytes === 0) {
        return new ArrayBuffer(0);
      }

      var abv = new Uint8Array(arraybuffer);
      var result = new Uint8Array(end - start);
      for (var i = start, ii = 0; i < end; i++, ii++) {
        result[ii] = abv[i];
      }
      return result.buffer;
    };

    var after_1 = after;

    function after(count, callback, err_cb) {
        var bail = false;
        err_cb = err_cb || noop$1;
        proxy.count = count;

        return (count === 0) ? callback() : proxy

        function proxy(err, result) {
            if (proxy.count <= 0) {
                throw new Error('after called too many times')
            }
            --proxy.count;

            // after first error, rest are passed to err_cb
            if (err) {
                bail = true;
                callback(err);
                // future error callbacks will go to error handler
                callback = err_cb;
            } else if (proxy.count === 0 && !bail) {
                callback(null, result);
            }
        }
    }

    function noop$1() {}

    /*! https://mths.be/utf8js v2.1.2 by @mathias */

    var stringFromCharCode = String.fromCharCode;

    // Taken from https://mths.be/punycode
    function ucs2decode(string) {
    	var output = [];
    	var counter = 0;
    	var length = string.length;
    	var value;
    	var extra;
    	while (counter < length) {
    		value = string.charCodeAt(counter++);
    		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
    			// high surrogate, and there is a next character
    			extra = string.charCodeAt(counter++);
    			if ((extra & 0xFC00) == 0xDC00) { // low surrogate
    				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
    			} else {
    				// unmatched surrogate; only append this code unit, in case the next
    				// code unit is the high surrogate of a surrogate pair
    				output.push(value);
    				counter--;
    			}
    		} else {
    			output.push(value);
    		}
    	}
    	return output;
    }

    // Taken from https://mths.be/punycode
    function ucs2encode(array) {
    	var length = array.length;
    	var index = -1;
    	var value;
    	var output = '';
    	while (++index < length) {
    		value = array[index];
    		if (value > 0xFFFF) {
    			value -= 0x10000;
    			output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
    			value = 0xDC00 | value & 0x3FF;
    		}
    		output += stringFromCharCode(value);
    	}
    	return output;
    }

    function checkScalarValue(codePoint, strict) {
    	if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
    		if (strict) {
    			throw Error(
    				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
    				' is not a scalar value'
    			);
    		}
    		return false;
    	}
    	return true;
    }
    /*--------------------------------------------------------------------------*/

    function createByte(codePoint, shift) {
    	return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
    }

    function encodeCodePoint(codePoint, strict) {
    	if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
    		return stringFromCharCode(codePoint);
    	}
    	var symbol = '';
    	if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
    		symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
    	}
    	else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
    		if (!checkScalarValue(codePoint, strict)) {
    			codePoint = 0xFFFD;
    		}
    		symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
    		symbol += createByte(codePoint, 6);
    	}
    	else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
    		symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
    		symbol += createByte(codePoint, 12);
    		symbol += createByte(codePoint, 6);
    	}
    	symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
    	return symbol;
    }

    function utf8encode(string, opts) {
    	opts = opts || {};
    	var strict = false !== opts.strict;

    	var codePoints = ucs2decode(string);
    	var length = codePoints.length;
    	var index = -1;
    	var codePoint;
    	var byteString = '';
    	while (++index < length) {
    		codePoint = codePoints[index];
    		byteString += encodeCodePoint(codePoint, strict);
    	}
    	return byteString;
    }

    /*--------------------------------------------------------------------------*/

    function readContinuationByte() {
    	if (byteIndex >= byteCount) {
    		throw Error('Invalid byte index');
    	}

    	var continuationByte = byteArray[byteIndex] & 0xFF;
    	byteIndex++;

    	if ((continuationByte & 0xC0) == 0x80) {
    		return continuationByte & 0x3F;
    	}

    	// If we end up here, it’s not a continuation byte
    	throw Error('Invalid continuation byte');
    }

    function decodeSymbol(strict) {
    	var byte1;
    	var byte2;
    	var byte3;
    	var byte4;
    	var codePoint;

    	if (byteIndex > byteCount) {
    		throw Error('Invalid byte index');
    	}

    	if (byteIndex == byteCount) {
    		return false;
    	}

    	// Read first byte
    	byte1 = byteArray[byteIndex] & 0xFF;
    	byteIndex++;

    	// 1-byte sequence (no continuation bytes)
    	if ((byte1 & 0x80) == 0) {
    		return byte1;
    	}

    	// 2-byte sequence
    	if ((byte1 & 0xE0) == 0xC0) {
    		byte2 = readContinuationByte();
    		codePoint = ((byte1 & 0x1F) << 6) | byte2;
    		if (codePoint >= 0x80) {
    			return codePoint;
    		} else {
    			throw Error('Invalid continuation byte');
    		}
    	}

    	// 3-byte sequence (may include unpaired surrogates)
    	if ((byte1 & 0xF0) == 0xE0) {
    		byte2 = readContinuationByte();
    		byte3 = readContinuationByte();
    		codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
    		if (codePoint >= 0x0800) {
    			return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
    		} else {
    			throw Error('Invalid continuation byte');
    		}
    	}

    	// 4-byte sequence
    	if ((byte1 & 0xF8) == 0xF0) {
    		byte2 = readContinuationByte();
    		byte3 = readContinuationByte();
    		byte4 = readContinuationByte();
    		codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
    			(byte3 << 0x06) | byte4;
    		if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
    			return codePoint;
    		}
    	}

    	throw Error('Invalid UTF-8 detected');
    }

    var byteArray;
    var byteCount;
    var byteIndex;
    function utf8decode(byteString, opts) {
    	opts = opts || {};
    	var strict = false !== opts.strict;

    	byteArray = ucs2decode(byteString);
    	byteCount = byteArray.length;
    	byteIndex = 0;
    	var codePoints = [];
    	var tmp;
    	while ((tmp = decodeSymbol(strict)) !== false) {
    		codePoints.push(tmp);
    	}
    	return ucs2encode(codePoints);
    }

    var utf8 = {
    	version: '2.1.2',
    	encode: utf8encode,
    	decode: utf8decode
    };

    var base64Arraybuffer = createCommonjsModule(function (module, exports) {
    /*
     * base64-arraybuffer
     * https://github.com/niklasvh/base64-arraybuffer
     *
     * Copyright (c) 2012 Niklas von Hertzen
     * Licensed under the MIT license.
     */
    (function(){

      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

      // Use a lookup table to find the index.
      var lookup = new Uint8Array(256);
      for (var i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
      }

      exports.encode = function(arraybuffer) {
        var bytes = new Uint8Array(arraybuffer),
        i, len = bytes.length, base64 = "";

        for (i = 0; i < len; i+=3) {
          base64 += chars[bytes[i] >> 2];
          base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
          base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
          base64 += chars[bytes[i + 2] & 63];
        }

        if ((len % 3) === 2) {
          base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
          base64 = base64.substring(0, base64.length - 2) + "==";
        }

        return base64;
      };

      exports.decode =  function(base64) {
        var bufferLength = base64.length * 0.75,
        len = base64.length, i, p = 0,
        encoded1, encoded2, encoded3, encoded4;

        if (base64[base64.length - 1] === "=") {
          bufferLength--;
          if (base64[base64.length - 2] === "=") {
            bufferLength--;
          }
        }

        var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

        for (i = 0; i < len; i+=4) {
          encoded1 = lookup[base64.charCodeAt(i)];
          encoded2 = lookup[base64.charCodeAt(i+1)];
          encoded3 = lookup[base64.charCodeAt(i+2)];
          encoded4 = lookup[base64.charCodeAt(i+3)];

          bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
          bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
          bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }

        return arraybuffer;
      };
    })();
    });
    var base64Arraybuffer_1 = base64Arraybuffer.encode;
    var base64Arraybuffer_2 = base64Arraybuffer.decode;

    /**
     * Create a blob builder even when vendor prefixes exist
     */

    var BlobBuilder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
      typeof WebKitBlobBuilder !== 'undefined' ? WebKitBlobBuilder :
      typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
      typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : 
      false;

    /**
     * Check if Blob constructor is supported
     */

    var blobSupported = (function() {
      try {
        var a = new Blob(['hi']);
        return a.size === 2;
      } catch(e) {
        return false;
      }
    })();

    /**
     * Check if Blob constructor supports ArrayBufferViews
     * Fails in Safari 6, so we need to map to ArrayBuffers there.
     */

    var blobSupportsArrayBufferView = blobSupported && (function() {
      try {
        var b = new Blob([new Uint8Array([1,2])]);
        return b.size === 2;
      } catch(e) {
        return false;
      }
    })();

    /**
     * Check if BlobBuilder is supported
     */

    var blobBuilderSupported = BlobBuilder
      && BlobBuilder.prototype.append
      && BlobBuilder.prototype.getBlob;

    /**
     * Helper function that maps ArrayBufferViews to ArrayBuffers
     * Used by BlobBuilder constructor and old browsers that didn't
     * support it in the Blob constructor.
     */

    function mapArrayBufferViews(ary) {
      return ary.map(function(chunk) {
        if (chunk.buffer instanceof ArrayBuffer) {
          var buf = chunk.buffer;

          // if this is a subarray, make a copy so we only
          // include the subarray region from the underlying buffer
          if (chunk.byteLength !== buf.byteLength) {
            var copy = new Uint8Array(chunk.byteLength);
            copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
            buf = copy.buffer;
          }

          return buf;
        }

        return chunk;
      });
    }

    function BlobBuilderConstructor(ary, options) {
      options = options || {};

      var bb = new BlobBuilder();
      mapArrayBufferViews(ary).forEach(function(part) {
        bb.append(part);
      });

      return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
    }
    function BlobConstructor(ary, options) {
      return new Blob(mapArrayBufferViews(ary), options || {});
    }
    if (typeof Blob !== 'undefined') {
      BlobBuilderConstructor.prototype = Blob.prototype;
      BlobConstructor.prototype = Blob.prototype;
    }

    var blob = (function() {
      if (blobSupported) {
        return blobSupportsArrayBufferView ? Blob : BlobConstructor;
      } else if (blobBuilderSupported) {
        return BlobBuilderConstructor;
      } else {
        return undefined;
      }
    })();

    var browser$2 = createCommonjsModule(function (module, exports) {
    /**
     * Module dependencies.
     */







    var base64encoder;
    if (typeof ArrayBuffer !== 'undefined') {
      base64encoder = base64Arraybuffer;
    }

    /**
     * Check if we are running an android browser. That requires us to use
     * ArrayBuffer with polling transports...
     *
     * http://ghinda.net/jpeg-blob-ajax-android/
     */

    var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

    /**
     * Check if we are running in PhantomJS.
     * Uploading a Blob with PhantomJS does not work correctly, as reported here:
     * https://github.com/ariya/phantomjs/issues/11395
     * @type boolean
     */
    var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

    /**
     * When true, avoids using Blobs to encode payloads.
     * @type boolean
     */
    var dontSendBlobs = isAndroid || isPhantomJS;

    /**
     * Current protocol version.
     */

    exports.protocol = 3;

    /**
     * Packet types.
     */

    var packets = exports.packets = {
        open:     0    // non-ws
      , close:    1    // non-ws
      , ping:     2
      , pong:     3
      , message:  4
      , upgrade:  5
      , noop:     6
    };

    var packetslist = keys(packets);

    /**
     * Premade error packet.
     */

    var err = { type: 'error', data: 'parser error' };

    /**
     * Create a blob api even for blob builder when vendor prefixes exist
     */



    /**
     * Encodes a packet.
     *
     *     <packet type id> [ <data> ]
     *
     * Example:
     *
     *     5hello world
     *     3
     *     4
     *
     * Binary is encoded in an identical principle
     *
     * @api private
     */

    exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
      if (typeof supportsBinary === 'function') {
        callback = supportsBinary;
        supportsBinary = false;
      }

      if (typeof utf8encode === 'function') {
        callback = utf8encode;
        utf8encode = null;
      }

      var data = (packet.data === undefined)
        ? undefined
        : packet.data.buffer || packet.data;

      if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
        return encodeArrayBuffer(packet, supportsBinary, callback);
      } else if (typeof blob !== 'undefined' && data instanceof blob) {
        return encodeBlob(packet, supportsBinary, callback);
      }

      // might be an object with { base64: true, data: dataAsBase64String }
      if (data && data.base64) {
        return encodeBase64Object(packet, callback);
      }

      // Sending data as a utf-8 string
      var encoded = packets[packet.type];

      // data fragment is optional
      if (undefined !== packet.data) {
        encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
      }

      return callback('' + encoded);

    };

    function encodeBase64Object(packet, callback) {
      // packet data is an object { base64: true, data: dataAsBase64String }
      var message = 'b' + exports.packets[packet.type] + packet.data.data;
      return callback(message);
    }

    /**
     * Encode packet helpers for binary types
     */

    function encodeArrayBuffer(packet, supportsBinary, callback) {
      if (!supportsBinary) {
        return exports.encodeBase64Packet(packet, callback);
      }

      var data = packet.data;
      var contentArray = new Uint8Array(data);
      var resultBuffer = new Uint8Array(1 + data.byteLength);

      resultBuffer[0] = packets[packet.type];
      for (var i = 0; i < contentArray.length; i++) {
        resultBuffer[i+1] = contentArray[i];
      }

      return callback(resultBuffer.buffer);
    }

    function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
      if (!supportsBinary) {
        return exports.encodeBase64Packet(packet, callback);
      }

      var fr = new FileReader();
      fr.onload = function() {
        exports.encodePacket({ type: packet.type, data: fr.result }, supportsBinary, true, callback);
      };
      return fr.readAsArrayBuffer(packet.data);
    }

    function encodeBlob(packet, supportsBinary, callback) {
      if (!supportsBinary) {
        return exports.encodeBase64Packet(packet, callback);
      }

      if (dontSendBlobs) {
        return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
      }

      var length = new Uint8Array(1);
      length[0] = packets[packet.type];
      var blob$1 = new blob([length.buffer, packet.data]);

      return callback(blob$1);
    }

    /**
     * Encodes a packet with binary data in a base64 string
     *
     * @param {Object} packet, has `type` and `data`
     * @return {String} base64 encoded message
     */

    exports.encodeBase64Packet = function(packet, callback) {
      var message = 'b' + exports.packets[packet.type];
      if (typeof blob !== 'undefined' && packet.data instanceof blob) {
        var fr = new FileReader();
        fr.onload = function() {
          var b64 = fr.result.split(',')[1];
          callback(message + b64);
        };
        return fr.readAsDataURL(packet.data);
      }

      var b64data;
      try {
        b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
      } catch (e) {
        // iPhone Safari doesn't let you apply with typed arrays
        var typed = new Uint8Array(packet.data);
        var basic = new Array(typed.length);
        for (var i = 0; i < typed.length; i++) {
          basic[i] = typed[i];
        }
        b64data = String.fromCharCode.apply(null, basic);
      }
      message += btoa(b64data);
      return callback(message);
    };

    /**
     * Decodes a packet. Changes format to Blob if requested.
     *
     * @return {Object} with `type` and `data` (if any)
     * @api private
     */

    exports.decodePacket = function (data, binaryType, utf8decode) {
      if (data === undefined) {
        return err;
      }
      // String data
      if (typeof data === 'string') {
        if (data.charAt(0) === 'b') {
          return exports.decodeBase64Packet(data.substr(1), binaryType);
        }

        if (utf8decode) {
          data = tryDecode(data);
          if (data === false) {
            return err;
          }
        }
        var type = data.charAt(0);

        if (Number(type) != type || !packetslist[type]) {
          return err;
        }

        if (data.length > 1) {
          return { type: packetslist[type], data: data.substring(1) };
        } else {
          return { type: packetslist[type] };
        }
      }

      var asArray = new Uint8Array(data);
      var type = asArray[0];
      var rest = arraybuffer_slice(data, 1);
      if (blob && binaryType === 'blob') {
        rest = new blob([rest]);
      }
      return { type: packetslist[type], data: rest };
    };

    function tryDecode(data) {
      try {
        data = utf8.decode(data, { strict: false });
      } catch (e) {
        return false;
      }
      return data;
    }

    /**
     * Decodes a packet encoded in a base64 string
     *
     * @param {String} base64 encoded message
     * @return {Object} with `type` and `data` (if any)
     */

    exports.decodeBase64Packet = function(msg, binaryType) {
      var type = packetslist[msg.charAt(0)];
      if (!base64encoder) {
        return { type: type, data: { base64: true, data: msg.substr(1) } };
      }

      var data = base64encoder.decode(msg.substr(1));

      if (binaryType === 'blob' && blob) {
        data = new blob([data]);
      }

      return { type: type, data: data };
    };

    /**
     * Encodes multiple messages (payload).
     *
     *     <length>:data
     *
     * Example:
     *
     *     11:hello world2:hi
     *
     * If any contents are binary, they will be encoded as base64 strings. Base64
     * encoded strings are marked with a b before the length specifier
     *
     * @param {Array} packets
     * @api private
     */

    exports.encodePayload = function (packets, supportsBinary, callback) {
      if (typeof supportsBinary === 'function') {
        callback = supportsBinary;
        supportsBinary = null;
      }

      var isBinary = hasBinary2(packets);

      if (supportsBinary && isBinary) {
        if (blob && !dontSendBlobs) {
          return exports.encodePayloadAsBlob(packets, callback);
        }

        return exports.encodePayloadAsArrayBuffer(packets, callback);
      }

      if (!packets.length) {
        return callback('0:');
      }

      function setLengthHeader(message) {
        return message.length + ':' + message;
      }

      function encodeOne(packet, doneCallback) {
        exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
          doneCallback(null, setLengthHeader(message));
        });
      }

      map(packets, encodeOne, function(err, results) {
        return callback(results.join(''));
      });
    };

    /**
     * Async array map using after
     */

    function map(ary, each, done) {
      var result = new Array(ary.length);
      var next = after_1(ary.length, done);

      var eachWithIndex = function(i, el, cb) {
        each(el, function(error, msg) {
          result[i] = msg;
          cb(error, result);
        });
      };

      for (var i = 0; i < ary.length; i++) {
        eachWithIndex(i, ary[i], next);
      }
    }

    /*
     * Decodes data when a payload is maybe expected. Possible binary contents are
     * decoded from their base64 representation
     *
     * @param {String} data, callback method
     * @api public
     */

    exports.decodePayload = function (data, binaryType, callback) {
      if (typeof data !== 'string') {
        return exports.decodePayloadAsBinary(data, binaryType, callback);
      }

      if (typeof binaryType === 'function') {
        callback = binaryType;
        binaryType = null;
      }

      var packet;
      if (data === '') {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      var length = '', n, msg;

      for (var i = 0, l = data.length; i < l; i++) {
        var chr = data.charAt(i);

        if (chr !== ':') {
          length += chr;
          continue;
        }

        if (length === '' || (length != (n = Number(length)))) {
          // parser error - ignoring payload
          return callback(err, 0, 1);
        }

        msg = data.substr(i + 1, n);

        if (length != msg.length) {
          // parser error - ignoring payload
          return callback(err, 0, 1);
        }

        if (msg.length) {
          packet = exports.decodePacket(msg, binaryType, false);

          if (err.type === packet.type && err.data === packet.data) {
            // parser error in individual packet - ignoring payload
            return callback(err, 0, 1);
          }

          var ret = callback(packet, i + n, l);
          if (false === ret) return;
        }

        // advance cursor
        i += n;
        length = '';
      }

      if (length !== '') {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

    };

    /**
     * Encodes multiple messages (payload) as binary.
     *
     * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
     * 255><data>
     *
     * Example:
     * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
     *
     * @param {Array} packets
     * @return {ArrayBuffer} encoded payload
     * @api private
     */

    exports.encodePayloadAsArrayBuffer = function(packets, callback) {
      if (!packets.length) {
        return callback(new ArrayBuffer(0));
      }

      function encodeOne(packet, doneCallback) {
        exports.encodePacket(packet, true, true, function(data) {
          return doneCallback(null, data);
        });
      }

      map(packets, encodeOne, function(err, encodedPackets) {
        var totalLength = encodedPackets.reduce(function(acc, p) {
          var len;
          if (typeof p === 'string'){
            len = p.length;
          } else {
            len = p.byteLength;
          }
          return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
        }, 0);

        var resultArray = new Uint8Array(totalLength);

        var bufferIndex = 0;
        encodedPackets.forEach(function(p) {
          var isString = typeof p === 'string';
          var ab = p;
          if (isString) {
            var view = new Uint8Array(p.length);
            for (var i = 0; i < p.length; i++) {
              view[i] = p.charCodeAt(i);
            }
            ab = view.buffer;
          }

          if (isString) { // not true binary
            resultArray[bufferIndex++] = 0;
          } else { // true binary
            resultArray[bufferIndex++] = 1;
          }

          var lenStr = ab.byteLength.toString();
          for (var i = 0; i < lenStr.length; i++) {
            resultArray[bufferIndex++] = parseInt(lenStr[i]);
          }
          resultArray[bufferIndex++] = 255;

          var view = new Uint8Array(ab);
          for (var i = 0; i < view.length; i++) {
            resultArray[bufferIndex++] = view[i];
          }
        });

        return callback(resultArray.buffer);
      });
    };

    /**
     * Encode as Blob
     */

    exports.encodePayloadAsBlob = function(packets, callback) {
      function encodeOne(packet, doneCallback) {
        exports.encodePacket(packet, true, true, function(encoded) {
          var binaryIdentifier = new Uint8Array(1);
          binaryIdentifier[0] = 1;
          if (typeof encoded === 'string') {
            var view = new Uint8Array(encoded.length);
            for (var i = 0; i < encoded.length; i++) {
              view[i] = encoded.charCodeAt(i);
            }
            encoded = view.buffer;
            binaryIdentifier[0] = 0;
          }

          var len = (encoded instanceof ArrayBuffer)
            ? encoded.byteLength
            : encoded.size;

          var lenStr = len.toString();
          var lengthAry = new Uint8Array(lenStr.length + 1);
          for (var i = 0; i < lenStr.length; i++) {
            lengthAry[i] = parseInt(lenStr[i]);
          }
          lengthAry[lenStr.length] = 255;

          if (blob) {
            var blob$1 = new blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
            doneCallback(null, blob$1);
          }
        });
      }

      map(packets, encodeOne, function(err, results) {
        return callback(new blob(results));
      });
    };

    /*
     * Decodes data when a payload is maybe expected. Strings are decoded by
     * interpreting each byte as a key code for entries marked to start with 0. See
     * description of encodePayloadAsBinary
     *
     * @param {ArrayBuffer} data, callback method
     * @api public
     */

    exports.decodePayloadAsBinary = function (data, binaryType, callback) {
      if (typeof binaryType === 'function') {
        callback = binaryType;
        binaryType = null;
      }

      var bufferTail = data;
      var buffers = [];

      while (bufferTail.byteLength > 0) {
        var tailArray = new Uint8Array(bufferTail);
        var isString = tailArray[0] === 0;
        var msgLength = '';

        for (var i = 1; ; i++) {
          if (tailArray[i] === 255) break;

          // 310 = char length of Number.MAX_VALUE
          if (msgLength.length > 310) {
            return callback(err, 0, 1);
          }

          msgLength += tailArray[i];
        }

        bufferTail = arraybuffer_slice(bufferTail, 2 + msgLength.length);
        msgLength = parseInt(msgLength);

        var msg = arraybuffer_slice(bufferTail, 0, msgLength);
        if (isString) {
          try {
            msg = String.fromCharCode.apply(null, new Uint8Array(msg));
          } catch (e) {
            // iPhone Safari doesn't let you apply to typed arrays
            var typed = new Uint8Array(msg);
            msg = '';
            for (var i = 0; i < typed.length; i++) {
              msg += String.fromCharCode(typed[i]);
            }
          }
        }

        buffers.push(msg);
        bufferTail = arraybuffer_slice(bufferTail, msgLength);
      }

      var total = buffers.length;
      buffers.forEach(function(buffer, i) {
        callback(exports.decodePacket(buffer, binaryType, true), i, total);
      });
    };
    });
    var browser_1$2 = browser$2.protocol;
    var browser_2$2 = browser$2.packets;
    var browser_3$2 = browser$2.encodePacket;
    var browser_4$2 = browser$2.encodeBase64Packet;
    var browser_5$2 = browser$2.decodePacket;
    var browser_6$2 = browser$2.decodeBase64Packet;
    var browser_7$2 = browser$2.encodePayload;
    var browser_8 = browser$2.decodePayload;
    var browser_9 = browser$2.encodePayloadAsArrayBuffer;
    var browser_10 = browser$2.encodePayloadAsBlob;
    var browser_11 = browser$2.decodePayloadAsBinary;

    var componentEmitter$1 = createCommonjsModule(function (module) {
    /**
     * Expose `Emitter`.
     */

    {
      module.exports = Emitter;
    }

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }
    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      // Remove event specific arrays for event types that no
      // one is subscribed for to avoid memory leak.
      if (callbacks.length === 0) {
        delete this._callbacks['$' + event];
      }

      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};

      var args = new Array(arguments.length - 1)
        , callbacks = this._callbacks['$' + event];

      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };
    });

    /**
     * Module dependencies.
     */




    /**
     * Module exports.
     */

    var transport = Transport;

    /**
     * Transport abstract constructor.
     *
     * @param {Object} options.
     * @api private
     */

    function Transport (opts) {
      this.path = opts.path;
      this.hostname = opts.hostname;
      this.port = opts.port;
      this.secure = opts.secure;
      this.query = opts.query;
      this.timestampParam = opts.timestampParam;
      this.timestampRequests = opts.timestampRequests;
      this.readyState = '';
      this.agent = opts.agent || false;
      this.socket = opts.socket;
      this.enablesXDR = opts.enablesXDR;
      this.withCredentials = opts.withCredentials;

      // SSL options for Node.js client
      this.pfx = opts.pfx;
      this.key = opts.key;
      this.passphrase = opts.passphrase;
      this.cert = opts.cert;
      this.ca = opts.ca;
      this.ciphers = opts.ciphers;
      this.rejectUnauthorized = opts.rejectUnauthorized;
      this.forceNode = opts.forceNode;

      // results of ReactNative environment detection
      this.isReactNative = opts.isReactNative;

      // other options for Node.js client
      this.extraHeaders = opts.extraHeaders;
      this.localAddress = opts.localAddress;
    }

    /**
     * Mix in `Emitter`.
     */

    componentEmitter$1(Transport.prototype);

    /**
     * Emits an error.
     *
     * @param {String} str
     * @return {Transport} for chaining
     * @api public
     */

    Transport.prototype.onError = function (msg, desc) {
      var err = new Error(msg);
      err.type = 'TransportError';
      err.description = desc;
      this.emit('error', err);
      return this;
    };

    /**
     * Opens the transport.
     *
     * @api public
     */

    Transport.prototype.open = function () {
      if ('closed' === this.readyState || '' === this.readyState) {
        this.readyState = 'opening';
        this.doOpen();
      }

      return this;
    };

    /**
     * Closes the transport.
     *
     * @api private
     */

    Transport.prototype.close = function () {
      if ('opening' === this.readyState || 'open' === this.readyState) {
        this.doClose();
        this.onClose();
      }

      return this;
    };

    /**
     * Sends multiple packets.
     *
     * @param {Array} packets
     * @api private
     */

    Transport.prototype.send = function (packets) {
      if ('open' === this.readyState) {
        this.write(packets);
      } else {
        throw new Error('Transport not open');
      }
    };

    /**
     * Called upon open
     *
     * @api private
     */

    Transport.prototype.onOpen = function () {
      this.readyState = 'open';
      this.writable = true;
      this.emit('open');
    };

    /**
     * Called with data.
     *
     * @param {String} data
     * @api private
     */

    Transport.prototype.onData = function (data) {
      var packet = browser$2.decodePacket(data, this.socket.binaryType);
      this.onPacket(packet);
    };

    /**
     * Called with a decoded packet.
     */

    Transport.prototype.onPacket = function (packet) {
      this.emit('packet', packet);
    };

    /**
     * Called upon close.
     *
     * @api private
     */

    Transport.prototype.onClose = function () {
      this.readyState = 'closed';
      this.emit('close');
    };

    /**
     * Compiles a querystring
     * Returns string representation of the object
     *
     * @param {Object}
     * @api private
     */

    var encode = function (obj) {
      var str = '';

      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (str.length) str += '&';
          str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
        }
      }

      return str;
    };

    /**
     * Parses a simple querystring into an object
     *
     * @param {String} qs
     * @api private
     */

    var decode = function(qs){
      var qry = {};
      var pairs = qs.split('&');
      for (var i = 0, l = pairs.length; i < l; i++) {
        var pair = pairs[i].split('=');
        qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
      return qry;
    };

    var parseqs = {
    	encode: encode,
    	decode: decode
    };

    var componentInherit = function(a, b){
      var fn = function(){};
      fn.prototype = b.prototype;
      a.prototype = new fn;
      a.prototype.constructor = a;
    };

    var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
      , length = 64
      , map = {}
      , seed = 0
      , i = 0
      , prev;

    /**
     * Return a string representing the specified number.
     *
     * @param {Number} num The number to convert.
     * @returns {String} The string representation of the number.
     * @api public
     */
    function encode$1(num) {
      var encoded = '';

      do {
        encoded = alphabet[num % length] + encoded;
        num = Math.floor(num / length);
      } while (num > 0);

      return encoded;
    }

    /**
     * Return the integer value specified by the given string.
     *
     * @param {String} str The string to convert.
     * @returns {Number} The integer value represented by the string.
     * @api public
     */
    function decode$1(str) {
      var decoded = 0;

      for (i = 0; i < str.length; i++) {
        decoded = decoded * length + map[str.charAt(i)];
      }

      return decoded;
    }

    /**
     * Yeast: A tiny growing id generator.
     *
     * @returns {String} A unique id.
     * @api public
     */
    function yeast() {
      var now = encode$1(+new Date());

      if (now !== prev) return seed = 0, prev = now;
      return now +'.'+ encode$1(seed++);
    }

    //
    // Map each character to its index.
    //
    for (; i < length; i++) map[alphabet[i]] = i;

    //
    // Expose the `yeast`, `encode` and `decode` functions.
    //
    yeast.encode = encode$1;
    yeast.decode = decode$1;
    var yeast_1 = yeast;

    /**
     * Module dependencies.
     */






    var debug$2 = browser('engine.io-client:polling');

    /**
     * Module exports.
     */

    var polling = Polling;

    /**
     * Is XHR2 supported?
     */

    var hasXHR2 = (function () {
      var XMLHttpRequest = xmlhttprequest;
      var xhr = new XMLHttpRequest({ xdomain: false });
      return null != xhr.responseType;
    })();

    /**
     * Polling interface.
     *
     * @param {Object} opts
     * @api private
     */

    function Polling (opts) {
      var forceBase64 = (opts && opts.forceBase64);
      if (!hasXHR2 || forceBase64) {
        this.supportsBinary = false;
      }
      transport.call(this, opts);
    }

    /**
     * Inherits from Transport.
     */

    componentInherit(Polling, transport);

    /**
     * Transport name.
     */

    Polling.prototype.name = 'polling';

    /**
     * Opens the socket (triggers polling). We write a PING message to determine
     * when the transport is open.
     *
     * @api private
     */

    Polling.prototype.doOpen = function () {
      this.poll();
    };

    /**
     * Pauses polling.
     *
     * @param {Function} callback upon buffers are flushed and transport is paused
     * @api private
     */

    Polling.prototype.pause = function (onPause) {
      var self = this;

      this.readyState = 'pausing';

      function pause () {
        debug$2('paused');
        self.readyState = 'paused';
        onPause();
      }

      if (this.polling || !this.writable) {
        var total = 0;

        if (this.polling) {
          debug$2('we are currently polling - waiting to pause');
          total++;
          this.once('pollComplete', function () {
            debug$2('pre-pause polling complete');
            --total || pause();
          });
        }

        if (!this.writable) {
          debug$2('we are currently writing - waiting to pause');
          total++;
          this.once('drain', function () {
            debug$2('pre-pause writing complete');
            --total || pause();
          });
        }
      } else {
        pause();
      }
    };

    /**
     * Starts polling cycle.
     *
     * @api public
     */

    Polling.prototype.poll = function () {
      debug$2('polling');
      this.polling = true;
      this.doPoll();
      this.emit('poll');
    };

    /**
     * Overloads onData to detect payloads.
     *
     * @api private
     */

    Polling.prototype.onData = function (data) {
      var self = this;
      debug$2('polling got data %s', data);
      var callback = function (packet, index, total) {
        // if its the first message we consider the transport open
        if ('opening' === self.readyState) {
          self.onOpen();
        }

        // if its a close packet, we close the ongoing requests
        if ('close' === packet.type) {
          self.onClose();
          return false;
        }

        // otherwise bypass onData and handle the message
        self.onPacket(packet);
      };

      // decode payload
      browser$2.decodePayload(data, this.socket.binaryType, callback);

      // if an event did not trigger closing
      if ('closed' !== this.readyState) {
        // if we got data we're not polling
        this.polling = false;
        this.emit('pollComplete');

        if ('open' === this.readyState) {
          this.poll();
        } else {
          debug$2('ignoring poll - transport state "%s"', this.readyState);
        }
      }
    };

    /**
     * For polling, send a close packet.
     *
     * @api private
     */

    Polling.prototype.doClose = function () {
      var self = this;

      function close () {
        debug$2('writing close packet');
        self.write([{ type: 'close' }]);
      }

      if ('open' === this.readyState) {
        debug$2('transport open - closing');
        close();
      } else {
        // in case we're trying to close while
        // handshaking is in progress (GH-164)
        debug$2('transport not open - deferring close');
        this.once('open', close);
      }
    };

    /**
     * Writes a packets payload.
     *
     * @param {Array} data packets
     * @param {Function} drain callback
     * @api private
     */

    Polling.prototype.write = function (packets) {
      var self = this;
      this.writable = false;
      var callbackfn = function () {
        self.writable = true;
        self.emit('drain');
      };

      browser$2.encodePayload(packets, this.supportsBinary, function (data) {
        self.doWrite(data, callbackfn);
      });
    };

    /**
     * Generates uri for connection.
     *
     * @api private
     */

    Polling.prototype.uri = function () {
      var query = this.query || {};
      var schema = this.secure ? 'https' : 'http';
      var port = '';

      // cache busting is forced
      if (false !== this.timestampRequests) {
        query[this.timestampParam] = yeast_1();
      }

      if (!this.supportsBinary && !query.sid) {
        query.b64 = 1;
      }

      query = parseqs.encode(query);

      // avoid port if default for schema
      if (this.port && (('https' === schema && Number(this.port) !== 443) ||
         ('http' === schema && Number(this.port) !== 80))) {
        port = ':' + this.port;
      }

      // prepend ? to query
      if (query.length) {
        query = '?' + query;
      }

      var ipv6 = this.hostname.indexOf(':') !== -1;
      return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
    };

    /* global attachEvent */

    /**
     * Module requirements.
     */





    var debug$3 = browser('engine.io-client:polling-xhr');


    /**
     * Module exports.
     */

    var pollingXhr = XHR;
    var Request_1 = Request;

    /**
     * Empty function
     */

    function empty$1 () {}

    /**
     * XHR Polling constructor.
     *
     * @param {Object} opts
     * @api public
     */

    function XHR (opts) {
      polling.call(this, opts);
      this.requestTimeout = opts.requestTimeout;
      this.extraHeaders = opts.extraHeaders;

      if (typeof location !== 'undefined') {
        var isSSL = 'https:' === location.protocol;
        var port = location.port;

        // some user agents have empty `location.port`
        if (!port) {
          port = isSSL ? 443 : 80;
        }

        this.xd = (typeof location !== 'undefined' && opts.hostname !== location.hostname) ||
          port !== opts.port;
        this.xs = opts.secure !== isSSL;
      }
    }

    /**
     * Inherits from Polling.
     */

    componentInherit(XHR, polling);

    /**
     * XHR supports binary
     */

    XHR.prototype.supportsBinary = true;

    /**
     * Creates a request.
     *
     * @param {String} method
     * @api private
     */

    XHR.prototype.request = function (opts) {
      opts = opts || {};
      opts.uri = this.uri();
      opts.xd = this.xd;
      opts.xs = this.xs;
      opts.agent = this.agent || false;
      opts.supportsBinary = this.supportsBinary;
      opts.enablesXDR = this.enablesXDR;
      opts.withCredentials = this.withCredentials;

      // SSL options for Node.js client
      opts.pfx = this.pfx;
      opts.key = this.key;
      opts.passphrase = this.passphrase;
      opts.cert = this.cert;
      opts.ca = this.ca;
      opts.ciphers = this.ciphers;
      opts.rejectUnauthorized = this.rejectUnauthorized;
      opts.requestTimeout = this.requestTimeout;

      // other options for Node.js client
      opts.extraHeaders = this.extraHeaders;

      return new Request(opts);
    };

    /**
     * Sends data.
     *
     * @param {String} data to send.
     * @param {Function} called upon flush.
     * @api private
     */

    XHR.prototype.doWrite = function (data, fn) {
      var isBinary = typeof data !== 'string' && data !== undefined;
      var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
      var self = this;
      req.on('success', fn);
      req.on('error', function (err) {
        self.onError('xhr post error', err);
      });
      this.sendXhr = req;
    };

    /**
     * Starts a poll cycle.
     *
     * @api private
     */

    XHR.prototype.doPoll = function () {
      debug$3('xhr poll');
      var req = this.request();
      var self = this;
      req.on('data', function (data) {
        self.onData(data);
      });
      req.on('error', function (err) {
        self.onError('xhr poll error', err);
      });
      this.pollXhr = req;
    };

    /**
     * Request constructor
     *
     * @param {Object} options
     * @api public
     */

    function Request (opts) {
      this.method = opts.method || 'GET';
      this.uri = opts.uri;
      this.xd = !!opts.xd;
      this.xs = !!opts.xs;
      this.async = false !== opts.async;
      this.data = undefined !== opts.data ? opts.data : null;
      this.agent = opts.agent;
      this.isBinary = opts.isBinary;
      this.supportsBinary = opts.supportsBinary;
      this.enablesXDR = opts.enablesXDR;
      this.withCredentials = opts.withCredentials;
      this.requestTimeout = opts.requestTimeout;

      // SSL options for Node.js client
      this.pfx = opts.pfx;
      this.key = opts.key;
      this.passphrase = opts.passphrase;
      this.cert = opts.cert;
      this.ca = opts.ca;
      this.ciphers = opts.ciphers;
      this.rejectUnauthorized = opts.rejectUnauthorized;

      // other options for Node.js client
      this.extraHeaders = opts.extraHeaders;

      this.create();
    }

    /**
     * Mix in `Emitter`.
     */

    componentEmitter$1(Request.prototype);

    /**
     * Creates the XHR object and sends the request.
     *
     * @api private
     */

    Request.prototype.create = function () {
      var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

      // SSL options for Node.js client
      opts.pfx = this.pfx;
      opts.key = this.key;
      opts.passphrase = this.passphrase;
      opts.cert = this.cert;
      opts.ca = this.ca;
      opts.ciphers = this.ciphers;
      opts.rejectUnauthorized = this.rejectUnauthorized;

      var xhr = this.xhr = new xmlhttprequest(opts);
      var self = this;

      try {
        debug$3('xhr open %s: %s', this.method, this.uri);
        xhr.open(this.method, this.uri, this.async);
        try {
          if (this.extraHeaders) {
            xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
            for (var i in this.extraHeaders) {
              if (this.extraHeaders.hasOwnProperty(i)) {
                xhr.setRequestHeader(i, this.extraHeaders[i]);
              }
            }
          }
        } catch (e) {}

        if ('POST' === this.method) {
          try {
            if (this.isBinary) {
              xhr.setRequestHeader('Content-type', 'application/octet-stream');
            } else {
              xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
            }
          } catch (e) {}
        }

        try {
          xhr.setRequestHeader('Accept', '*/*');
        } catch (e) {}

        // ie6 check
        if ('withCredentials' in xhr) {
          xhr.withCredentials = this.withCredentials;
        }

        if (this.requestTimeout) {
          xhr.timeout = this.requestTimeout;
        }

        if (this.hasXDR()) {
          xhr.onload = function () {
            self.onLoad();
          };
          xhr.onerror = function () {
            self.onError(xhr.responseText);
          };
        } else {
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 2) {
              try {
                var contentType = xhr.getResponseHeader('Content-Type');
                if (self.supportsBinary && contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
                  xhr.responseType = 'arraybuffer';
                }
              } catch (e) {}
            }
            if (4 !== xhr.readyState) return;
            if (200 === xhr.status || 1223 === xhr.status) {
              self.onLoad();
            } else {
              // make sure the `error` event handler that's user-set
              // does not throw in the same tick and gets caught here
              setTimeout(function () {
                self.onError(typeof xhr.status === 'number' ? xhr.status : 0);
              }, 0);
            }
          };
        }

        debug$3('xhr data %s', this.data);
        xhr.send(this.data);
      } catch (e) {
        // Need to defer since .create() is called directly fhrom the constructor
        // and thus the 'error' event can only be only bound *after* this exception
        // occurs.  Therefore, also, we cannot throw here at all.
        setTimeout(function () {
          self.onError(e);
        }, 0);
        return;
      }

      if (typeof document !== 'undefined') {
        this.index = Request.requestsCount++;
        Request.requests[this.index] = this;
      }
    };

    /**
     * Called upon successful response.
     *
     * @api private
     */

    Request.prototype.onSuccess = function () {
      this.emit('success');
      this.cleanup();
    };

    /**
     * Called if we have data.
     *
     * @api private
     */

    Request.prototype.onData = function (data) {
      this.emit('data', data);
      this.onSuccess();
    };

    /**
     * Called upon error.
     *
     * @api private
     */

    Request.prototype.onError = function (err) {
      this.emit('error', err);
      this.cleanup(true);
    };

    /**
     * Cleans up house.
     *
     * @api private
     */

    Request.prototype.cleanup = function (fromError) {
      if ('undefined' === typeof this.xhr || null === this.xhr) {
        return;
      }
      // xmlhttprequest
      if (this.hasXDR()) {
        this.xhr.onload = this.xhr.onerror = empty$1;
      } else {
        this.xhr.onreadystatechange = empty$1;
      }

      if (fromError) {
        try {
          this.xhr.abort();
        } catch (e) {}
      }

      if (typeof document !== 'undefined') {
        delete Request.requests[this.index];
      }

      this.xhr = null;
    };

    /**
     * Called upon load.
     *
     * @api private
     */

    Request.prototype.onLoad = function () {
      var data;
      try {
        var contentType;
        try {
          contentType = this.xhr.getResponseHeader('Content-Type');
        } catch (e) {}
        if (contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
          data = this.xhr.response || this.xhr.responseText;
        } else {
          data = this.xhr.responseText;
        }
      } catch (e) {
        this.onError(e);
      }
      if (null != data) {
        this.onData(data);
      }
    };

    /**
     * Check if it has XDomainRequest.
     *
     * @api private
     */

    Request.prototype.hasXDR = function () {
      return typeof XDomainRequest !== 'undefined' && !this.xs && this.enablesXDR;
    };

    /**
     * Aborts the request.
     *
     * @api public
     */

    Request.prototype.abort = function () {
      this.cleanup();
    };

    /**
     * Aborts pending requests when unloading the window. This is needed to prevent
     * memory leaks (e.g. when using IE) and to ensure that no spurious error is
     * emitted.
     */

    Request.requestsCount = 0;
    Request.requests = {};

    if (typeof document !== 'undefined') {
      if (typeof attachEvent === 'function') {
        attachEvent('onunload', unloadHandler);
      } else if (typeof addEventListener === 'function') {
        var terminationEvent = 'onpagehide' in globalThis_browser ? 'pagehide' : 'unload';
        addEventListener(terminationEvent, unloadHandler, false);
      }
    }

    function unloadHandler () {
      for (var i in Request.requests) {
        if (Request.requests.hasOwnProperty(i)) {
          Request.requests[i].abort();
        }
      }
    }
    pollingXhr.Request = Request_1;

    /**
     * Module requirements.
     */





    /**
     * Module exports.
     */

    var pollingJsonp = JSONPPolling;

    /**
     * Cached regular expressions.
     */

    var rNewline = /\n/g;
    var rEscapedNewline = /\\n/g;

    /**
     * Global JSONP callbacks.
     */

    var callbacks;

    /**
     * Noop.
     */

    function empty$2 () { }

    /**
     * JSONP Polling constructor.
     *
     * @param {Object} opts.
     * @api public
     */

    function JSONPPolling (opts) {
      polling.call(this, opts);

      this.query = this.query || {};

      // define global callbacks array if not present
      // we do this here (lazily) to avoid unneeded global pollution
      if (!callbacks) {
        // we need to consider multiple engines in the same page
        callbacks = globalThis_browser.___eio = (globalThis_browser.___eio || []);
      }

      // callback identifier
      this.index = callbacks.length;

      // add callback to jsonp global
      var self = this;
      callbacks.push(function (msg) {
        self.onData(msg);
      });

      // append to query string
      this.query.j = this.index;

      // prevent spurious errors from being emitted when the window is unloaded
      if (typeof addEventListener === 'function') {
        addEventListener('beforeunload', function () {
          if (self.script) self.script.onerror = empty$2;
        }, false);
      }
    }

    /**
     * Inherits from Polling.
     */

    componentInherit(JSONPPolling, polling);

    /*
     * JSONP only supports binary as base64 encoded strings
     */

    JSONPPolling.prototype.supportsBinary = false;

    /**
     * Closes the socket.
     *
     * @api private
     */

    JSONPPolling.prototype.doClose = function () {
      if (this.script) {
        this.script.parentNode.removeChild(this.script);
        this.script = null;
      }

      if (this.form) {
        this.form.parentNode.removeChild(this.form);
        this.form = null;
        this.iframe = null;
      }

      polling.prototype.doClose.call(this);
    };

    /**
     * Starts a poll cycle.
     *
     * @api private
     */

    JSONPPolling.prototype.doPoll = function () {
      var self = this;
      var script = document.createElement('script');

      if (this.script) {
        this.script.parentNode.removeChild(this.script);
        this.script = null;
      }

      script.async = true;
      script.src = this.uri();
      script.onerror = function (e) {
        self.onError('jsonp poll error', e);
      };

      var insertAt = document.getElementsByTagName('script')[0];
      if (insertAt) {
        insertAt.parentNode.insertBefore(script, insertAt);
      } else {
        (document.head || document.body).appendChild(script);
      }
      this.script = script;

      var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

      if (isUAgecko) {
        setTimeout(function () {
          var iframe = document.createElement('iframe');
          document.body.appendChild(iframe);
          document.body.removeChild(iframe);
        }, 100);
      }
    };

    /**
     * Writes with a hidden iframe.
     *
     * @param {String} data to send
     * @param {Function} called upon flush.
     * @api private
     */

    JSONPPolling.prototype.doWrite = function (data, fn) {
      var self = this;

      if (!this.form) {
        var form = document.createElement('form');
        var area = document.createElement('textarea');
        var id = this.iframeId = 'eio_iframe_' + this.index;
        var iframe;

        form.className = 'socketio';
        form.style.position = 'absolute';
        form.style.top = '-1000px';
        form.style.left = '-1000px';
        form.target = id;
        form.method = 'POST';
        form.setAttribute('accept-charset', 'utf-8');
        area.name = 'd';
        form.appendChild(area);
        document.body.appendChild(form);

        this.form = form;
        this.area = area;
      }

      this.form.action = this.uri();

      function complete () {
        initIframe();
        fn();
      }

      function initIframe () {
        if (self.iframe) {
          try {
            self.form.removeChild(self.iframe);
          } catch (e) {
            self.onError('jsonp polling iframe removal error', e);
          }
        }

        try {
          // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
          var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
          iframe = document.createElement(html);
        } catch (e) {
          iframe = document.createElement('iframe');
          iframe.name = self.iframeId;
          iframe.src = 'javascript:0';
        }

        iframe.id = self.iframeId;

        self.form.appendChild(iframe);
        self.iframe = iframe;
      }

      initIframe();

      // escape \n to prevent it from being converted into \r\n by some UAs
      // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
      data = data.replace(rEscapedNewline, '\\\n');
      this.area.value = data.replace(rNewline, '\\n');

      try {
        this.form.submit();
      } catch (e) {}

      if (this.iframe.attachEvent) {
        this.iframe.onreadystatechange = function () {
          if (self.iframe.readyState === 'complete') {
            complete();
          }
        };
      } else {
        this.iframe.onload = complete;
      }
    };

    var _nodeResolve_empty = {};

    var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': _nodeResolve_empty
    });

    var require$$1 = getCjsExportFromNamespace(_nodeResolve_empty$1);

    /**
     * Module dependencies.
     */






    var debug$4 = browser('engine.io-client:websocket');

    var BrowserWebSocket, NodeWebSocket;

    if (typeof WebSocket !== 'undefined') {
      BrowserWebSocket = WebSocket;
    } else if (typeof self !== 'undefined') {
      BrowserWebSocket = self.WebSocket || self.MozWebSocket;
    }

    if (typeof window === 'undefined') {
      try {
        NodeWebSocket = require$$1;
      } catch (e) { }
    }

    /**
     * Get either the `WebSocket` or `MozWebSocket` globals
     * in the browser or try to resolve WebSocket-compatible
     * interface exposed by `ws` for Node-like environment.
     */

    var WebSocketImpl = BrowserWebSocket || NodeWebSocket;

    /**
     * Module exports.
     */

    var websocket = WS;

    /**
     * WebSocket transport constructor.
     *
     * @api {Object} connection options
     * @api public
     */

    function WS (opts) {
      var forceBase64 = (opts && opts.forceBase64);
      if (forceBase64) {
        this.supportsBinary = false;
      }
      this.perMessageDeflate = opts.perMessageDeflate;
      this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
      this.protocols = opts.protocols;
      if (!this.usingBrowserWebSocket) {
        WebSocketImpl = NodeWebSocket;
      }
      transport.call(this, opts);
    }

    /**
     * Inherits from Transport.
     */

    componentInherit(WS, transport);

    /**
     * Transport name.
     *
     * @api public
     */

    WS.prototype.name = 'websocket';

    /*
     * WebSockets support binary
     */

    WS.prototype.supportsBinary = true;

    /**
     * Opens socket.
     *
     * @api private
     */

    WS.prototype.doOpen = function () {
      if (!this.check()) {
        // let probe timeout
        return;
      }

      var uri = this.uri();
      var protocols = this.protocols;
      var opts = {
        agent: this.agent,
        perMessageDeflate: this.perMessageDeflate
      };

      // SSL options for Node.js client
      opts.pfx = this.pfx;
      opts.key = this.key;
      opts.passphrase = this.passphrase;
      opts.cert = this.cert;
      opts.ca = this.ca;
      opts.ciphers = this.ciphers;
      opts.rejectUnauthorized = this.rejectUnauthorized;
      if (this.extraHeaders) {
        opts.headers = this.extraHeaders;
      }
      if (this.localAddress) {
        opts.localAddress = this.localAddress;
      }

      try {
        this.ws =
          this.usingBrowserWebSocket && !this.isReactNative
            ? protocols
              ? new WebSocketImpl(uri, protocols)
              : new WebSocketImpl(uri)
            : new WebSocketImpl(uri, protocols, opts);
      } catch (err) {
        return this.emit('error', err);
      }

      if (this.ws.binaryType === undefined) {
        this.supportsBinary = false;
      }

      if (this.ws.supports && this.ws.supports.binary) {
        this.supportsBinary = true;
        this.ws.binaryType = 'nodebuffer';
      } else {
        this.ws.binaryType = 'arraybuffer';
      }

      this.addEventListeners();
    };

    /**
     * Adds event listeners to the socket
     *
     * @api private
     */

    WS.prototype.addEventListeners = function () {
      var self = this;

      this.ws.onopen = function () {
        self.onOpen();
      };
      this.ws.onclose = function () {
        self.onClose();
      };
      this.ws.onmessage = function (ev) {
        self.onData(ev.data);
      };
      this.ws.onerror = function (e) {
        self.onError('websocket error', e);
      };
    };

    /**
     * Writes data to socket.
     *
     * @param {Array} array of packets.
     * @api private
     */

    WS.prototype.write = function (packets) {
      var self = this;
      this.writable = false;

      // encodePacket efficient as it uses WS framing
      // no need for encodePayload
      var total = packets.length;
      for (var i = 0, l = total; i < l; i++) {
        (function (packet) {
          browser$2.encodePacket(packet, self.supportsBinary, function (data) {
            if (!self.usingBrowserWebSocket) {
              // always create a new object (GH-437)
              var opts = {};
              if (packet.options) {
                opts.compress = packet.options.compress;
              }

              if (self.perMessageDeflate) {
                var len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
                if (len < self.perMessageDeflate.threshold) {
                  opts.compress = false;
                }
              }
            }

            // Sometimes the websocket has already been closed but the browser didn't
            // have a chance of informing us about it yet, in that case send will
            // throw an error
            try {
              if (self.usingBrowserWebSocket) {
                // TypeError is thrown when passing the second argument on Safari
                self.ws.send(data);
              } else {
                self.ws.send(data, opts);
              }
            } catch (e) {
              debug$4('websocket closed before onclose event');
            }

            --total || done();
          });
        })(packets[i]);
      }

      function done () {
        self.emit('flush');

        // fake drain
        // defer to next tick to allow Socket to clear writeBuffer
        setTimeout(function () {
          self.writable = true;
          self.emit('drain');
        }, 0);
      }
    };

    /**
     * Called upon close
     *
     * @api private
     */

    WS.prototype.onClose = function () {
      transport.prototype.onClose.call(this);
    };

    /**
     * Closes socket.
     *
     * @api private
     */

    WS.prototype.doClose = function () {
      if (typeof this.ws !== 'undefined') {
        this.ws.close();
      }
    };

    /**
     * Generates uri for connection.
     *
     * @api private
     */

    WS.prototype.uri = function () {
      var query = this.query || {};
      var schema = this.secure ? 'wss' : 'ws';
      var port = '';

      // avoid port if default for schema
      if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
        ('ws' === schema && Number(this.port) !== 80))) {
        port = ':' + this.port;
      }

      // append timestamp to URI
      if (this.timestampRequests) {
        query[this.timestampParam] = yeast_1();
      }

      // communicate binary support capabilities
      if (!this.supportsBinary) {
        query.b64 = 1;
      }

      query = parseqs.encode(query);

      // prepend ? to query
      if (query.length) {
        query = '?' + query;
      }

      var ipv6 = this.hostname.indexOf(':') !== -1;
      return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
    };

    /**
     * Feature detection for WebSocket.
     *
     * @return {Boolean} whether this transport is available.
     * @api public
     */

    WS.prototype.check = function () {
      return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
    };

    /**
     * Module dependencies
     */






    /**
     * Export transports.
     */

    var polling_1 = polling$1;
    var websocket_1 = websocket;

    /**
     * Polling transport polymorphic constructor.
     * Decides on xhr vs jsonp based on feature detection.
     *
     * @api private
     */

    function polling$1 (opts) {
      var xhr;
      var xd = false;
      var xs = false;
      var jsonp = false !== opts.jsonp;

      if (typeof location !== 'undefined') {
        var isSSL = 'https:' === location.protocol;
        var port = location.port;

        // some user agents have empty `location.port`
        if (!port) {
          port = isSSL ? 443 : 80;
        }

        xd = opts.hostname !== location.hostname || port !== opts.port;
        xs = opts.secure !== isSSL;
      }

      opts.xdomain = xd;
      opts.xscheme = xs;
      xhr = new xmlhttprequest(opts);

      if ('open' in xhr && !opts.forceJSONP) {
        return new pollingXhr(opts);
      } else {
        if (!jsonp) throw new Error('JSONP disabled');
        return new pollingJsonp(opts);
      }
    }

    var transports = {
    	polling: polling_1,
    	websocket: websocket_1
    };

    var indexOf = [].indexOf;

    var indexof = function(arr, obj){
      if (indexOf) return arr.indexOf(obj);
      for (var i = 0; i < arr.length; ++i) {
        if (arr[i] === obj) return i;
      }
      return -1;
    };

    /**
     * Module dependencies.
     */



    var debug$5 = browser('engine.io-client:socket');





    /**
     * Module exports.
     */

    var socket = Socket;

    /**
     * Socket constructor.
     *
     * @param {String|Object} uri or options
     * @param {Object} options
     * @api public
     */

    function Socket (uri, opts) {
      if (!(this instanceof Socket)) return new Socket(uri, opts);

      opts = opts || {};

      if (uri && 'object' === typeof uri) {
        opts = uri;
        uri = null;
      }

      if (uri) {
        uri = parseuri(uri);
        opts.hostname = uri.host;
        opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
        opts.port = uri.port;
        if (uri.query) opts.query = uri.query;
      } else if (opts.host) {
        opts.hostname = parseuri(opts.host).host;
      }

      this.secure = null != opts.secure ? opts.secure
        : (typeof location !== 'undefined' && 'https:' === location.protocol);

      if (opts.hostname && !opts.port) {
        // if no port is specified manually, use the protocol default
        opts.port = this.secure ? '443' : '80';
      }

      this.agent = opts.agent || false;
      this.hostname = opts.hostname ||
        (typeof location !== 'undefined' ? location.hostname : 'localhost');
      this.port = opts.port || (typeof location !== 'undefined' && location.port
          ? location.port
          : (this.secure ? 443 : 80));
      this.query = opts.query || {};
      if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
      this.upgrade = false !== opts.upgrade;
      this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
      this.forceJSONP = !!opts.forceJSONP;
      this.jsonp = false !== opts.jsonp;
      this.forceBase64 = !!opts.forceBase64;
      this.enablesXDR = !!opts.enablesXDR;
      this.withCredentials = false !== opts.withCredentials;
      this.timestampParam = opts.timestampParam || 't';
      this.timestampRequests = opts.timestampRequests;
      this.transports = opts.transports || ['polling', 'websocket'];
      this.transportOptions = opts.transportOptions || {};
      this.readyState = '';
      this.writeBuffer = [];
      this.prevBufferLen = 0;
      this.policyPort = opts.policyPort || 843;
      this.rememberUpgrade = opts.rememberUpgrade || false;
      this.binaryType = null;
      this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
      this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

      if (true === this.perMessageDeflate) this.perMessageDeflate = {};
      if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
        this.perMessageDeflate.threshold = 1024;
      }

      // SSL options for Node.js client
      this.pfx = opts.pfx || null;
      this.key = opts.key || null;
      this.passphrase = opts.passphrase || null;
      this.cert = opts.cert || null;
      this.ca = opts.ca || null;
      this.ciphers = opts.ciphers || null;
      this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
      this.forceNode = !!opts.forceNode;

      // detect ReactNative environment
      this.isReactNative = (typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative');

      // other options for Node.js or ReactNative client
      if (typeof self === 'undefined' || this.isReactNative) {
        if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
          this.extraHeaders = opts.extraHeaders;
        }

        if (opts.localAddress) {
          this.localAddress = opts.localAddress;
        }
      }

      // set on handshake
      this.id = null;
      this.upgrades = null;
      this.pingInterval = null;
      this.pingTimeout = null;

      // set on heartbeat
      this.pingIntervalTimer = null;
      this.pingTimeoutTimer = null;

      this.open();
    }

    Socket.priorWebsocketSuccess = false;

    /**
     * Mix in `Emitter`.
     */

    componentEmitter$1(Socket.prototype);

    /**
     * Protocol version.
     *
     * @api public
     */

    Socket.protocol = browser$2.protocol; // this is an int

    /**
     * Expose deps for legacy compatibility
     * and standalone browser access.
     */

    Socket.Socket = Socket;
    Socket.Transport = transport;
    Socket.transports = transports;
    Socket.parser = browser$2;

    /**
     * Creates transport of the given type.
     *
     * @param {String} transport name
     * @return {Transport}
     * @api private
     */

    Socket.prototype.createTransport = function (name) {
      debug$5('creating transport "%s"', name);
      var query = clone(this.query);

      // append engine.io protocol identifier
      query.EIO = browser$2.protocol;

      // transport name
      query.transport = name;

      // per-transport options
      var options = this.transportOptions[name] || {};

      // session id if we already have one
      if (this.id) query.sid = this.id;

      var transport = new transports[name]({
        query: query,
        socket: this,
        agent: options.agent || this.agent,
        hostname: options.hostname || this.hostname,
        port: options.port || this.port,
        secure: options.secure || this.secure,
        path: options.path || this.path,
        forceJSONP: options.forceJSONP || this.forceJSONP,
        jsonp: options.jsonp || this.jsonp,
        forceBase64: options.forceBase64 || this.forceBase64,
        enablesXDR: options.enablesXDR || this.enablesXDR,
        withCredentials: options.withCredentials || this.withCredentials,
        timestampRequests: options.timestampRequests || this.timestampRequests,
        timestampParam: options.timestampParam || this.timestampParam,
        policyPort: options.policyPort || this.policyPort,
        pfx: options.pfx || this.pfx,
        key: options.key || this.key,
        passphrase: options.passphrase || this.passphrase,
        cert: options.cert || this.cert,
        ca: options.ca || this.ca,
        ciphers: options.ciphers || this.ciphers,
        rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
        perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
        extraHeaders: options.extraHeaders || this.extraHeaders,
        forceNode: options.forceNode || this.forceNode,
        localAddress: options.localAddress || this.localAddress,
        requestTimeout: options.requestTimeout || this.requestTimeout,
        protocols: options.protocols || void (0),
        isReactNative: this.isReactNative
      });

      return transport;
    };

    function clone (obj) {
      var o = {};
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          o[i] = obj[i];
        }
      }
      return o;
    }

    /**
     * Initializes transport to use and starts probe.
     *
     * @api private
     */
    Socket.prototype.open = function () {
      var transport;
      if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
        transport = 'websocket';
      } else if (0 === this.transports.length) {
        // Emit error on next tick so it can be listened to
        var self = this;
        setTimeout(function () {
          self.emit('error', 'No transports available');
        }, 0);
        return;
      } else {
        transport = this.transports[0];
      }
      this.readyState = 'opening';

      // Retry with the next transport if the transport is disabled (jsonp: false)
      try {
        transport = this.createTransport(transport);
      } catch (e) {
        this.transports.shift();
        this.open();
        return;
      }

      transport.open();
      this.setTransport(transport);
    };

    /**
     * Sets the current transport. Disables the existing one (if any).
     *
     * @api private
     */

    Socket.prototype.setTransport = function (transport) {
      debug$5('setting transport %s', transport.name);
      var self = this;

      if (this.transport) {
        debug$5('clearing existing transport %s', this.transport.name);
        this.transport.removeAllListeners();
      }

      // set up transport
      this.transport = transport;

      // set up transport listeners
      transport
      .on('drain', function () {
        self.onDrain();
      })
      .on('packet', function (packet) {
        self.onPacket(packet);
      })
      .on('error', function (e) {
        self.onError(e);
      })
      .on('close', function () {
        self.onClose('transport close');
      });
    };

    /**
     * Probes a transport.
     *
     * @param {String} transport name
     * @api private
     */

    Socket.prototype.probe = function (name) {
      debug$5('probing transport "%s"', name);
      var transport = this.createTransport(name, { probe: 1 });
      var failed = false;
      var self = this;

      Socket.priorWebsocketSuccess = false;

      function onTransportOpen () {
        if (self.onlyBinaryUpgrades) {
          var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
          failed = failed || upgradeLosesBinary;
        }
        if (failed) return;

        debug$5('probe transport "%s" opened', name);
        transport.send([{ type: 'ping', data: 'probe' }]);
        transport.once('packet', function (msg) {
          if (failed) return;
          if ('pong' === msg.type && 'probe' === msg.data) {
            debug$5('probe transport "%s" pong', name);
            self.upgrading = true;
            self.emit('upgrading', transport);
            if (!transport) return;
            Socket.priorWebsocketSuccess = 'websocket' === transport.name;

            debug$5('pausing current transport "%s"', self.transport.name);
            self.transport.pause(function () {
              if (failed) return;
              if ('closed' === self.readyState) return;
              debug$5('changing transport and sending upgrade packet');

              cleanup();

              self.setTransport(transport);
              transport.send([{ type: 'upgrade' }]);
              self.emit('upgrade', transport);
              transport = null;
              self.upgrading = false;
              self.flush();
            });
          } else {
            debug$5('probe transport "%s" failed', name);
            var err = new Error('probe error');
            err.transport = transport.name;
            self.emit('upgradeError', err);
          }
        });
      }

      function freezeTransport () {
        if (failed) return;

        // Any callback called by transport should be ignored since now
        failed = true;

        cleanup();

        transport.close();
        transport = null;
      }

      // Handle any error that happens while probing
      function onerror (err) {
        var error = new Error('probe error: ' + err);
        error.transport = transport.name;

        freezeTransport();

        debug$5('probe transport "%s" failed because of error: %s', name, err);

        self.emit('upgradeError', error);
      }

      function onTransportClose () {
        onerror('transport closed');
      }

      // When the socket is closed while we're probing
      function onclose () {
        onerror('socket closed');
      }

      // When the socket is upgraded while we're probing
      function onupgrade (to) {
        if (transport && to.name !== transport.name) {
          debug$5('"%s" works - aborting "%s"', to.name, transport.name);
          freezeTransport();
        }
      }

      // Remove all listeners on the transport and on self
      function cleanup () {
        transport.removeListener('open', onTransportOpen);
        transport.removeListener('error', onerror);
        transport.removeListener('close', onTransportClose);
        self.removeListener('close', onclose);
        self.removeListener('upgrading', onupgrade);
      }

      transport.once('open', onTransportOpen);
      transport.once('error', onerror);
      transport.once('close', onTransportClose);

      this.once('close', onclose);
      this.once('upgrading', onupgrade);

      transport.open();
    };

    /**
     * Called when connection is deemed open.
     *
     * @api public
     */

    Socket.prototype.onOpen = function () {
      debug$5('socket open');
      this.readyState = 'open';
      Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
      this.emit('open');
      this.flush();

      // we check for `readyState` in case an `open`
      // listener already closed the socket
      if ('open' === this.readyState && this.upgrade && this.transport.pause) {
        debug$5('starting upgrade probes');
        for (var i = 0, l = this.upgrades.length; i < l; i++) {
          this.probe(this.upgrades[i]);
        }
      }
    };

    /**
     * Handles a packet.
     *
     * @api private
     */

    Socket.prototype.onPacket = function (packet) {
      if ('opening' === this.readyState || 'open' === this.readyState ||
          'closing' === this.readyState) {
        debug$5('socket receive: type "%s", data "%s"', packet.type, packet.data);

        this.emit('packet', packet);

        // Socket is live - any packet counts
        this.emit('heartbeat');

        switch (packet.type) {
          case 'open':
            this.onHandshake(JSON.parse(packet.data));
            break;

          case 'pong':
            this.setPing();
            this.emit('pong');
            break;

          case 'error':
            var err = new Error('server error');
            err.code = packet.data;
            this.onError(err);
            break;

          case 'message':
            this.emit('data', packet.data);
            this.emit('message', packet.data);
            break;
        }
      } else {
        debug$5('packet received with socket readyState "%s"', this.readyState);
      }
    };

    /**
     * Called upon handshake completion.
     *
     * @param {Object} handshake obj
     * @api private
     */

    Socket.prototype.onHandshake = function (data) {
      this.emit('handshake', data);
      this.id = data.sid;
      this.transport.query.sid = data.sid;
      this.upgrades = this.filterUpgrades(data.upgrades);
      this.pingInterval = data.pingInterval;
      this.pingTimeout = data.pingTimeout;
      this.onOpen();
      // In case open handler closes socket
      if ('closed' === this.readyState) return;
      this.setPing();

      // Prolong liveness of socket on heartbeat
      this.removeListener('heartbeat', this.onHeartbeat);
      this.on('heartbeat', this.onHeartbeat);
    };

    /**
     * Resets ping timeout.
     *
     * @api private
     */

    Socket.prototype.onHeartbeat = function (timeout) {
      clearTimeout(this.pingTimeoutTimer);
      var self = this;
      self.pingTimeoutTimer = setTimeout(function () {
        if ('closed' === self.readyState) return;
        self.onClose('ping timeout');
      }, timeout || (self.pingInterval + self.pingTimeout));
    };

    /**
     * Pings server every `this.pingInterval` and expects response
     * within `this.pingTimeout` or closes connection.
     *
     * @api private
     */

    Socket.prototype.setPing = function () {
      var self = this;
      clearTimeout(self.pingIntervalTimer);
      self.pingIntervalTimer = setTimeout(function () {
        debug$5('writing ping packet - expecting pong within %sms', self.pingTimeout);
        self.ping();
        self.onHeartbeat(self.pingTimeout);
      }, self.pingInterval);
    };

    /**
    * Sends a ping packet.
    *
    * @api private
    */

    Socket.prototype.ping = function () {
      var self = this;
      this.sendPacket('ping', function () {
        self.emit('ping');
      });
    };

    /**
     * Called on `drain` event
     *
     * @api private
     */

    Socket.prototype.onDrain = function () {
      this.writeBuffer.splice(0, this.prevBufferLen);

      // setting prevBufferLen = 0 is very important
      // for example, when upgrading, upgrade packet is sent over,
      // and a nonzero prevBufferLen could cause problems on `drain`
      this.prevBufferLen = 0;

      if (0 === this.writeBuffer.length) {
        this.emit('drain');
      } else {
        this.flush();
      }
    };

    /**
     * Flush write buffers.
     *
     * @api private
     */

    Socket.prototype.flush = function () {
      if ('closed' !== this.readyState && this.transport.writable &&
        !this.upgrading && this.writeBuffer.length) {
        debug$5('flushing %d packets in socket', this.writeBuffer.length);
        this.transport.send(this.writeBuffer);
        // keep track of current length of writeBuffer
        // splice writeBuffer and callbackBuffer on `drain`
        this.prevBufferLen = this.writeBuffer.length;
        this.emit('flush');
      }
    };

    /**
     * Sends a message.
     *
     * @param {String} message.
     * @param {Function} callback function.
     * @param {Object} options.
     * @return {Socket} for chaining.
     * @api public
     */

    Socket.prototype.write =
    Socket.prototype.send = function (msg, options, fn) {
      this.sendPacket('message', msg, options, fn);
      return this;
    };

    /**
     * Sends a packet.
     *
     * @param {String} packet type.
     * @param {String} data.
     * @param {Object} options.
     * @param {Function} callback function.
     * @api private
     */

    Socket.prototype.sendPacket = function (type, data, options, fn) {
      if ('function' === typeof data) {
        fn = data;
        data = undefined;
      }

      if ('function' === typeof options) {
        fn = options;
        options = null;
      }

      if ('closing' === this.readyState || 'closed' === this.readyState) {
        return;
      }

      options = options || {};
      options.compress = false !== options.compress;

      var packet = {
        type: type,
        data: data,
        options: options
      };
      this.emit('packetCreate', packet);
      this.writeBuffer.push(packet);
      if (fn) this.once('flush', fn);
      this.flush();
    };

    /**
     * Closes the connection.
     *
     * @api private
     */

    Socket.prototype.close = function () {
      if ('opening' === this.readyState || 'open' === this.readyState) {
        this.readyState = 'closing';

        var self = this;

        if (this.writeBuffer.length) {
          this.once('drain', function () {
            if (this.upgrading) {
              waitForUpgrade();
            } else {
              close();
            }
          });
        } else if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      }

      function close () {
        self.onClose('forced close');
        debug$5('socket closing - telling transport to close');
        self.transport.close();
      }

      function cleanupAndClose () {
        self.removeListener('upgrade', cleanupAndClose);
        self.removeListener('upgradeError', cleanupAndClose);
        close();
      }

      function waitForUpgrade () {
        // wait for upgrade to finish since we can't send packets while pausing a transport
        self.once('upgrade', cleanupAndClose);
        self.once('upgradeError', cleanupAndClose);
      }

      return this;
    };

    /**
     * Called upon transport error
     *
     * @api private
     */

    Socket.prototype.onError = function (err) {
      debug$5('socket error %j', err);
      Socket.priorWebsocketSuccess = false;
      this.emit('error', err);
      this.onClose('transport error', err);
    };

    /**
     * Called upon transport close.
     *
     * @api private
     */

    Socket.prototype.onClose = function (reason, desc) {
      if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
        debug$5('socket close with reason: "%s"', reason);
        var self = this;

        // clear timers
        clearTimeout(this.pingIntervalTimer);
        clearTimeout(this.pingTimeoutTimer);

        // stop event from firing again for transport
        this.transport.removeAllListeners('close');

        // ensure transport won't stay open
        this.transport.close();

        // ignore further transport communication
        this.transport.removeAllListeners();

        // set ready state
        this.readyState = 'closed';

        // clear session id
        this.id = null;

        // emit close event
        this.emit('close', reason, desc);

        // clean buffers after, so users can still
        // grab the buffers on `close` event
        self.writeBuffer = [];
        self.prevBufferLen = 0;
      }
    };

    /**
     * Filters upgrades, returning only those matching client transports.
     *
     * @param {Array} server upgrades
     * @api private
     *
     */

    Socket.prototype.filterUpgrades = function (upgrades) {
      var filteredUpgrades = [];
      for (var i = 0, j = upgrades.length; i < j; i++) {
        if (~indexof(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
      }
      return filteredUpgrades;
    };

    var lib = socket;

    /**
     * Exports parser
     *
     * @api public
     *
     */
    var parser = browser$2;
    lib.parser = parser;

    var toArray_1 = toArray;

    function toArray(list, index) {
        var array = [];

        index = index || 0;

        for (var i = index || 0; i < list.length; i++) {
            array[i - index] = list[i];
        }

        return array
    }

    /**
     * Module exports.
     */

    var on_1 = on;

    /**
     * Helper for subscriptions.
     *
     * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
     * @param {String} event name
     * @param {Function} callback
     * @api public
     */

    function on (obj, ev, fn) {
      obj.on(ev, fn);
      return {
        destroy: function () {
          obj.removeListener(ev, fn);
        }
      };
    }

    /**
     * Slice reference.
     */

    var slice = [].slice;

    /**
     * Bind `obj` to `fn`.
     *
     * @param {Object} obj
     * @param {Function|String} fn or string
     * @return {Function}
     * @api public
     */

    var componentBind = function(obj, fn){
      if ('string' == typeof fn) fn = obj[fn];
      if ('function' != typeof fn) throw new Error('bind() requires a function');
      var args = slice.call(arguments, 2);
      return function(){
        return fn.apply(obj, args.concat(slice.call(arguments)));
      }
    };

    var socket$1 = createCommonjsModule(function (module, exports) {
    /**
     * Module dependencies.
     */






    var debug = browser('socket.io-client:socket');



    /**
     * Module exports.
     */

    module.exports = exports = Socket;

    /**
     * Internal events (blacklisted).
     * These events can't be emitted by the user.
     *
     * @api private
     */

    var events = {
      connect: 1,
      connect_error: 1,
      connect_timeout: 1,
      connecting: 1,
      disconnect: 1,
      error: 1,
      reconnect: 1,
      reconnect_attempt: 1,
      reconnect_failed: 1,
      reconnect_error: 1,
      reconnecting: 1,
      ping: 1,
      pong: 1
    };

    /**
     * Shortcut to `Emitter#emit`.
     */

    var emit = componentEmitter.prototype.emit;

    /**
     * `Socket` constructor.
     *
     * @api public
     */

    function Socket (io, nsp, opts) {
      this.io = io;
      this.nsp = nsp;
      this.json = this; // compat
      this.ids = 0;
      this.acks = {};
      this.receiveBuffer = [];
      this.sendBuffer = [];
      this.connected = false;
      this.disconnected = true;
      this.flags = {};
      if (opts && opts.query) {
        this.query = opts.query;
      }
      if (this.io.autoConnect) this.open();
    }

    /**
     * Mix in `Emitter`.
     */

    componentEmitter(Socket.prototype);

    /**
     * Subscribe to open, close and packet events
     *
     * @api private
     */

    Socket.prototype.subEvents = function () {
      if (this.subs) return;

      var io = this.io;
      this.subs = [
        on_1(io, 'open', componentBind(this, 'onopen')),
        on_1(io, 'packet', componentBind(this, 'onpacket')),
        on_1(io, 'close', componentBind(this, 'onclose'))
      ];
    };

    /**
     * "Opens" the socket.
     *
     * @api public
     */

    Socket.prototype.open =
    Socket.prototype.connect = function () {
      if (this.connected) return this;

      this.subEvents();
      this.io.open(); // ensure open
      if ('open' === this.io.readyState) this.onopen();
      this.emit('connecting');
      return this;
    };

    /**
     * Sends a `message` event.
     *
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.send = function () {
      var args = toArray_1(arguments);
      args.unshift('message');
      this.emit.apply(this, args);
      return this;
    };

    /**
     * Override `emit`.
     * If the event is in `events`, it's emitted normally.
     *
     * @param {String} event name
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.emit = function (ev) {
      if (events.hasOwnProperty(ev)) {
        emit.apply(this, arguments);
        return this;
      }

      var args = toArray_1(arguments);
      var packet = {
        type: (this.flags.binary !== undefined ? this.flags.binary : hasBinary2(args)) ? socket_ioParser.BINARY_EVENT : socket_ioParser.EVENT,
        data: args
      };

      packet.options = {};
      packet.options.compress = !this.flags || false !== this.flags.compress;

      // event ack callback
      if ('function' === typeof args[args.length - 1]) {
        debug('emitting packet with ack id %d', this.ids);
        this.acks[this.ids] = args.pop();
        packet.id = this.ids++;
      }

      if (this.connected) {
        this.packet(packet);
      } else {
        this.sendBuffer.push(packet);
      }

      this.flags = {};

      return this;
    };

    /**
     * Sends a packet.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.packet = function (packet) {
      packet.nsp = this.nsp;
      this.io.packet(packet);
    };

    /**
     * Called upon engine `open`.
     *
     * @api private
     */

    Socket.prototype.onopen = function () {
      debug('transport is open - connecting');

      // write connect packet if necessary
      if ('/' !== this.nsp) {
        if (this.query) {
          var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
          debug('sending connect packet with query %s', query);
          this.packet({type: socket_ioParser.CONNECT, query: query});
        } else {
          this.packet({type: socket_ioParser.CONNECT});
        }
      }
    };

    /**
     * Called upon engine `close`.
     *
     * @param {String} reason
     * @api private
     */

    Socket.prototype.onclose = function (reason) {
      debug('close (%s)', reason);
      this.connected = false;
      this.disconnected = true;
      delete this.id;
      this.emit('disconnect', reason);
    };

    /**
     * Called with socket packet.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.onpacket = function (packet) {
      var sameNamespace = packet.nsp === this.nsp;
      var rootNamespaceError = packet.type === socket_ioParser.ERROR && packet.nsp === '/';

      if (!sameNamespace && !rootNamespaceError) return;

      switch (packet.type) {
        case socket_ioParser.CONNECT:
          this.onconnect();
          break;

        case socket_ioParser.EVENT:
          this.onevent(packet);
          break;

        case socket_ioParser.BINARY_EVENT:
          this.onevent(packet);
          break;

        case socket_ioParser.ACK:
          this.onack(packet);
          break;

        case socket_ioParser.BINARY_ACK:
          this.onack(packet);
          break;

        case socket_ioParser.DISCONNECT:
          this.ondisconnect();
          break;

        case socket_ioParser.ERROR:
          this.emit('error', packet.data);
          break;
      }
    };

    /**
     * Called upon a server event.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.onevent = function (packet) {
      var args = packet.data || [];
      debug('emitting event %j', args);

      if (null != packet.id) {
        debug('attaching ack callback to event');
        args.push(this.ack(packet.id));
      }

      if (this.connected) {
        emit.apply(this, args);
      } else {
        this.receiveBuffer.push(args);
      }
    };

    /**
     * Produces an ack callback to emit with an event.
     *
     * @api private
     */

    Socket.prototype.ack = function (id) {
      var self = this;
      var sent = false;
      return function () {
        // prevent double callbacks
        if (sent) return;
        sent = true;
        var args = toArray_1(arguments);
        debug('sending ack %j', args);

        self.packet({
          type: hasBinary2(args) ? socket_ioParser.BINARY_ACK : socket_ioParser.ACK,
          id: id,
          data: args
        });
      };
    };

    /**
     * Called upon a server acknowlegement.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.onack = function (packet) {
      var ack = this.acks[packet.id];
      if ('function' === typeof ack) {
        debug('calling ack %s with %j', packet.id, packet.data);
        ack.apply(this, packet.data);
        delete this.acks[packet.id];
      } else {
        debug('bad ack %s', packet.id);
      }
    };

    /**
     * Called upon server connect.
     *
     * @api private
     */

    Socket.prototype.onconnect = function () {
      this.connected = true;
      this.disconnected = false;
      this.emit('connect');
      this.emitBuffered();
    };

    /**
     * Emit buffered events (received and emitted).
     *
     * @api private
     */

    Socket.prototype.emitBuffered = function () {
      var i;
      for (i = 0; i < this.receiveBuffer.length; i++) {
        emit.apply(this, this.receiveBuffer[i]);
      }
      this.receiveBuffer = [];

      for (i = 0; i < this.sendBuffer.length; i++) {
        this.packet(this.sendBuffer[i]);
      }
      this.sendBuffer = [];
    };

    /**
     * Called upon server disconnect.
     *
     * @api private
     */

    Socket.prototype.ondisconnect = function () {
      debug('server disconnect (%s)', this.nsp);
      this.destroy();
      this.onclose('io server disconnect');
    };

    /**
     * Called upon forced client/server side disconnections,
     * this method ensures the manager stops tracking us and
     * that reconnections don't get triggered for this.
     *
     * @api private.
     */

    Socket.prototype.destroy = function () {
      if (this.subs) {
        // clean subscriptions to avoid reconnections
        for (var i = 0; i < this.subs.length; i++) {
          this.subs[i].destroy();
        }
        this.subs = null;
      }

      this.io.destroy(this);
    };

    /**
     * Disconnects the socket manually.
     *
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.close =
    Socket.prototype.disconnect = function () {
      if (this.connected) {
        debug('performing disconnect (%s)', this.nsp);
        this.packet({ type: socket_ioParser.DISCONNECT });
      }

      // remove socket from pool
      this.destroy();

      if (this.connected) {
        // fire events
        this.onclose('io client disconnect');
      }
      return this;
    };

    /**
     * Sets the compress flag.
     *
     * @param {Boolean} if `true`, compresses the sending data
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.compress = function (compress) {
      this.flags.compress = compress;
      return this;
    };

    /**
     * Sets the binary flag
     *
     * @param {Boolean} whether the emitted data contains binary
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.binary = function (binary) {
      this.flags.binary = binary;
      return this;
    };
    });

    /**
     * Expose `Backoff`.
     */

    var backo2 = Backoff;

    /**
     * Initialize backoff timer with `opts`.
     *
     * - `min` initial timeout in milliseconds [100]
     * - `max` max timeout [10000]
     * - `jitter` [0]
     * - `factor` [2]
     *
     * @param {Object} opts
     * @api public
     */

    function Backoff(opts) {
      opts = opts || {};
      this.ms = opts.min || 100;
      this.max = opts.max || 10000;
      this.factor = opts.factor || 2;
      this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
      this.attempts = 0;
    }

    /**
     * Return the backoff duration.
     *
     * @return {Number}
     * @api public
     */

    Backoff.prototype.duration = function(){
      var ms = this.ms * Math.pow(this.factor, this.attempts++);
      if (this.jitter) {
        var rand =  Math.random();
        var deviation = Math.floor(rand * this.jitter * ms);
        ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
      }
      return Math.min(ms, this.max) | 0;
    };

    /**
     * Reset the number of attempts.
     *
     * @api public
     */

    Backoff.prototype.reset = function(){
      this.attempts = 0;
    };

    /**
     * Set the minimum duration
     *
     * @api public
     */

    Backoff.prototype.setMin = function(min){
      this.ms = min;
    };

    /**
     * Set the maximum duration
     *
     * @api public
     */

    Backoff.prototype.setMax = function(max){
      this.max = max;
    };

    /**
     * Set the jitter
     *
     * @api public
     */

    Backoff.prototype.setJitter = function(jitter){
      this.jitter = jitter;
    };

    /**
     * Module dependencies.
     */







    var debug$6 = browser('socket.io-client:manager');



    /**
     * IE6+ hasOwnProperty
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * Module exports
     */

    var manager = Manager;

    /**
     * `Manager` constructor.
     *
     * @param {String} engine instance or engine uri/opts
     * @param {Object} options
     * @api public
     */

    function Manager (uri, opts) {
      if (!(this instanceof Manager)) return new Manager(uri, opts);
      if (uri && ('object' === typeof uri)) {
        opts = uri;
        uri = undefined;
      }
      opts = opts || {};

      opts.path = opts.path || '/socket.io';
      this.nsps = {};
      this.subs = [];
      this.opts = opts;
      this.reconnection(opts.reconnection !== false);
      this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
      this.reconnectionDelay(opts.reconnectionDelay || 1000);
      this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
      this.randomizationFactor(opts.randomizationFactor || 0.5);
      this.backoff = new backo2({
        min: this.reconnectionDelay(),
        max: this.reconnectionDelayMax(),
        jitter: this.randomizationFactor()
      });
      this.timeout(null == opts.timeout ? 20000 : opts.timeout);
      this.readyState = 'closed';
      this.uri = uri;
      this.connecting = [];
      this.lastPing = null;
      this.encoding = false;
      this.packetBuffer = [];
      var _parser = opts.parser || socket_ioParser;
      this.encoder = new _parser.Encoder();
      this.decoder = new _parser.Decoder();
      this.autoConnect = opts.autoConnect !== false;
      if (this.autoConnect) this.open();
    }

    /**
     * Propagate given event to sockets and emit on `this`
     *
     * @api private
     */

    Manager.prototype.emitAll = function () {
      this.emit.apply(this, arguments);
      for (var nsp in this.nsps) {
        if (has.call(this.nsps, nsp)) {
          this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
        }
      }
    };

    /**
     * Update `socket.id` of all sockets
     *
     * @api private
     */

    Manager.prototype.updateSocketIds = function () {
      for (var nsp in this.nsps) {
        if (has.call(this.nsps, nsp)) {
          this.nsps[nsp].id = this.generateId(nsp);
        }
      }
    };

    /**
     * generate `socket.id` for the given `nsp`
     *
     * @param {String} nsp
     * @return {String}
     * @api private
     */

    Manager.prototype.generateId = function (nsp) {
      return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
    };

    /**
     * Mix in `Emitter`.
     */

    componentEmitter(Manager.prototype);

    /**
     * Sets the `reconnection` config.
     *
     * @param {Boolean} true/false if it should automatically reconnect
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnection = function (v) {
      if (!arguments.length) return this._reconnection;
      this._reconnection = !!v;
      return this;
    };

    /**
     * Sets the reconnection attempts config.
     *
     * @param {Number} max reconnection attempts before giving up
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnectionAttempts = function (v) {
      if (!arguments.length) return this._reconnectionAttempts;
      this._reconnectionAttempts = v;
      return this;
    };

    /**
     * Sets the delay between reconnections.
     *
     * @param {Number} delay
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnectionDelay = function (v) {
      if (!arguments.length) return this._reconnectionDelay;
      this._reconnectionDelay = v;
      this.backoff && this.backoff.setMin(v);
      return this;
    };

    Manager.prototype.randomizationFactor = function (v) {
      if (!arguments.length) return this._randomizationFactor;
      this._randomizationFactor = v;
      this.backoff && this.backoff.setJitter(v);
      return this;
    };

    /**
     * Sets the maximum delay between reconnections.
     *
     * @param {Number} delay
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnectionDelayMax = function (v) {
      if (!arguments.length) return this._reconnectionDelayMax;
      this._reconnectionDelayMax = v;
      this.backoff && this.backoff.setMax(v);
      return this;
    };

    /**
     * Sets the connection timeout. `false` to disable
     *
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.timeout = function (v) {
      if (!arguments.length) return this._timeout;
      this._timeout = v;
      return this;
    };

    /**
     * Starts trying to reconnect if reconnection is enabled and we have not
     * started reconnecting yet
     *
     * @api private
     */

    Manager.prototype.maybeReconnectOnOpen = function () {
      // Only try to reconnect if it's the first time we're connecting
      if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
        // keeps reconnection from firing twice for the same reconnection loop
        this.reconnect();
      }
    };

    /**
     * Sets the current transport `socket`.
     *
     * @param {Function} optional, callback
     * @return {Manager} self
     * @api public
     */

    Manager.prototype.open =
    Manager.prototype.connect = function (fn, opts) {
      debug$6('readyState %s', this.readyState);
      if (~this.readyState.indexOf('open')) return this;

      debug$6('opening %s', this.uri);
      this.engine = lib(this.uri, this.opts);
      var socket = this.engine;
      var self = this;
      this.readyState = 'opening';
      this.skipReconnect = false;

      // emit `open`
      var openSub = on_1(socket, 'open', function () {
        self.onopen();
        fn && fn();
      });

      // emit `connect_error`
      var errorSub = on_1(socket, 'error', function (data) {
        debug$6('connect_error');
        self.cleanup();
        self.readyState = 'closed';
        self.emitAll('connect_error', data);
        if (fn) {
          var err = new Error('Connection error');
          err.data = data;
          fn(err);
        } else {
          // Only do this if there is no fn to handle the error
          self.maybeReconnectOnOpen();
        }
      });

      // emit `connect_timeout`
      if (false !== this._timeout) {
        var timeout = this._timeout;
        debug$6('connect attempt will timeout after %d', timeout);

        // set timer
        var timer = setTimeout(function () {
          debug$6('connect attempt timed out after %d', timeout);
          openSub.destroy();
          socket.close();
          socket.emit('error', 'timeout');
          self.emitAll('connect_timeout', timeout);
        }, timeout);

        this.subs.push({
          destroy: function () {
            clearTimeout(timer);
          }
        });
      }

      this.subs.push(openSub);
      this.subs.push(errorSub);

      return this;
    };

    /**
     * Called upon transport open.
     *
     * @api private
     */

    Manager.prototype.onopen = function () {
      debug$6('open');

      // clear old subs
      this.cleanup();

      // mark as open
      this.readyState = 'open';
      this.emit('open');

      // add new subs
      var socket = this.engine;
      this.subs.push(on_1(socket, 'data', componentBind(this, 'ondata')));
      this.subs.push(on_1(socket, 'ping', componentBind(this, 'onping')));
      this.subs.push(on_1(socket, 'pong', componentBind(this, 'onpong')));
      this.subs.push(on_1(socket, 'error', componentBind(this, 'onerror')));
      this.subs.push(on_1(socket, 'close', componentBind(this, 'onclose')));
      this.subs.push(on_1(this.decoder, 'decoded', componentBind(this, 'ondecoded')));
    };

    /**
     * Called upon a ping.
     *
     * @api private
     */

    Manager.prototype.onping = function () {
      this.lastPing = new Date();
      this.emitAll('ping');
    };

    /**
     * Called upon a packet.
     *
     * @api private
     */

    Manager.prototype.onpong = function () {
      this.emitAll('pong', new Date() - this.lastPing);
    };

    /**
     * Called with data.
     *
     * @api private
     */

    Manager.prototype.ondata = function (data) {
      this.decoder.add(data);
    };

    /**
     * Called when parser fully decodes a packet.
     *
     * @api private
     */

    Manager.prototype.ondecoded = function (packet) {
      this.emit('packet', packet);
    };

    /**
     * Called upon socket error.
     *
     * @api private
     */

    Manager.prototype.onerror = function (err) {
      debug$6('error', err);
      this.emitAll('error', err);
    };

    /**
     * Creates a new socket for the given `nsp`.
     *
     * @return {Socket}
     * @api public
     */

    Manager.prototype.socket = function (nsp, opts) {
      var socket = this.nsps[nsp];
      if (!socket) {
        socket = new socket$1(this, nsp, opts);
        this.nsps[nsp] = socket;
        var self = this;
        socket.on('connecting', onConnecting);
        socket.on('connect', function () {
          socket.id = self.generateId(nsp);
        });

        if (this.autoConnect) {
          // manually call here since connecting event is fired before listening
          onConnecting();
        }
      }

      function onConnecting () {
        if (!~indexof(self.connecting, socket)) {
          self.connecting.push(socket);
        }
      }

      return socket;
    };

    /**
     * Called upon a socket close.
     *
     * @param {Socket} socket
     */

    Manager.prototype.destroy = function (socket) {
      var index = indexof(this.connecting, socket);
      if (~index) this.connecting.splice(index, 1);
      if (this.connecting.length) return;

      this.close();
    };

    /**
     * Writes a packet.
     *
     * @param {Object} packet
     * @api private
     */

    Manager.prototype.packet = function (packet) {
      debug$6('writing packet %j', packet);
      var self = this;
      if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

      if (!self.encoding) {
        // encode, then write to engine with result
        self.encoding = true;
        this.encoder.encode(packet, function (encodedPackets) {
          for (var i = 0; i < encodedPackets.length; i++) {
            self.engine.write(encodedPackets[i], packet.options);
          }
          self.encoding = false;
          self.processPacketQueue();
        });
      } else { // add packet to the queue
        self.packetBuffer.push(packet);
      }
    };

    /**
     * If packet buffer is non-empty, begins encoding the
     * next packet in line.
     *
     * @api private
     */

    Manager.prototype.processPacketQueue = function () {
      if (this.packetBuffer.length > 0 && !this.encoding) {
        var pack = this.packetBuffer.shift();
        this.packet(pack);
      }
    };

    /**
     * Clean up transport subscriptions and packet buffer.
     *
     * @api private
     */

    Manager.prototype.cleanup = function () {
      debug$6('cleanup');

      var subsLength = this.subs.length;
      for (var i = 0; i < subsLength; i++) {
        var sub = this.subs.shift();
        sub.destroy();
      }

      this.packetBuffer = [];
      this.encoding = false;
      this.lastPing = null;

      this.decoder.destroy();
    };

    /**
     * Close the current socket.
     *
     * @api private
     */

    Manager.prototype.close =
    Manager.prototype.disconnect = function () {
      debug$6('disconnect');
      this.skipReconnect = true;
      this.reconnecting = false;
      if ('opening' === this.readyState) {
        // `onclose` will not fire because
        // an open event never happened
        this.cleanup();
      }
      this.backoff.reset();
      this.readyState = 'closed';
      if (this.engine) this.engine.close();
    };

    /**
     * Called upon engine close.
     *
     * @api private
     */

    Manager.prototype.onclose = function (reason) {
      debug$6('onclose');

      this.cleanup();
      this.backoff.reset();
      this.readyState = 'closed';
      this.emit('close', reason);

      if (this._reconnection && !this.skipReconnect) {
        this.reconnect();
      }
    };

    /**
     * Attempt a reconnection.
     *
     * @api private
     */

    Manager.prototype.reconnect = function () {
      if (this.reconnecting || this.skipReconnect) return this;

      var self = this;

      if (this.backoff.attempts >= this._reconnectionAttempts) {
        debug$6('reconnect failed');
        this.backoff.reset();
        this.emitAll('reconnect_failed');
        this.reconnecting = false;
      } else {
        var delay = this.backoff.duration();
        debug$6('will wait %dms before reconnect attempt', delay);

        this.reconnecting = true;
        var timer = setTimeout(function () {
          if (self.skipReconnect) return;

          debug$6('attempting reconnect');
          self.emitAll('reconnect_attempt', self.backoff.attempts);
          self.emitAll('reconnecting', self.backoff.attempts);

          // check again for the case socket closed in above events
          if (self.skipReconnect) return;

          self.open(function (err) {
            if (err) {
              debug$6('reconnect attempt error');
              self.reconnecting = false;
              self.reconnect();
              self.emitAll('reconnect_error', err.data);
            } else {
              debug$6('reconnect success');
              self.onreconnect();
            }
          });
        }, delay);

        this.subs.push({
          destroy: function () {
            clearTimeout(timer);
          }
        });
      }
    };

    /**
     * Called upon successful reconnect.
     *
     * @api private
     */

    Manager.prototype.onreconnect = function () {
      var attempt = this.backoff.attempts;
      this.reconnecting = false;
      this.backoff.reset();
      this.updateSocketIds();
      this.emitAll('reconnect', attempt);
    };

    var lib$1 = createCommonjsModule(function (module, exports) {
    /**
     * Module dependencies.
     */




    var debug = browser('socket.io-client');

    /**
     * Module exports.
     */

    module.exports = exports = lookup;

    /**
     * Managers cache.
     */

    var cache = exports.managers = {};

    /**
     * Looks up an existing `Manager` for multiplexing.
     * If the user summons:
     *
     *   `io('http://localhost/a');`
     *   `io('http://localhost/b');`
     *
     * We reuse the existing instance based on same scheme/port/host,
     * and we initialize sockets for each namespace.
     *
     * @api public
     */

    function lookup (uri, opts) {
      if (typeof uri === 'object') {
        opts = uri;
        uri = undefined;
      }

      opts = opts || {};

      var parsed = url_1(uri);
      var source = parsed.source;
      var id = parsed.id;
      var path = parsed.path;
      var sameNamespace = cache[id] && path in cache[id].nsps;
      var newConnection = opts.forceNew || opts['force new connection'] ||
                          false === opts.multiplex || sameNamespace;

      var io;

      if (newConnection) {
        debug('ignoring socket cache for %s', source);
        io = manager(source, opts);
      } else {
        if (!cache[id]) {
          debug('new io instance for %s', source);
          cache[id] = manager(source, opts);
        }
        io = cache[id];
      }
      if (parsed.query && !opts.query) {
        opts.query = parsed.query;
      }
      return io.socket(parsed.path, opts);
    }

    /**
     * Protocol version.
     *
     * @api public
     */

    exports.protocol = socket_ioParser.protocol;

    /**
     * `connect`.
     *
     * @param {String} uri
     * @api public
     */

    exports.connect = lookup;

    /**
     * Expose constructors for standalone build.
     *
     * @api public
     */

    exports.Manager = manager;
    exports.Socket = socket$1;
    });
    var lib_1 = lib$1.managers;
    var lib_2 = lib$1.protocol;
    var lib_3 = lib$1.connect;
    var lib_4 = lib$1.Manager;
    var lib_5 = lib$1.Socket;

    const local = "http://localhost:4000/";
    const server = "https://checkasio-server.herokuapp.com/";
    const funcs = "https://us-central1-checker-io.cloudfunctions.net/";
    var env = {
    	local: local,
    	server: server,
    	funcs: funcs
    };

    const currSocket = writable(null);

    if(window.location.hostname.includes('localhost'))
        currSocket.set(lib$1(env.local, {transports: ['websocket'], upgrade: false}));
    else
        currSocket.set(lib$1(env.server, {transports: ['websocket'], upgrade: false}));

    const ratio = readable(screen.width / screen.height);

    const currUser = writable(null);

    const showNavBar = writable(true);

    const page = writable(0);

    const gameTab = writable(0);

    const peer = writable(null);

    const showPlayer = writable(false);

    const onCall = writable(false);

    const startTimeStamp = writable(moment().startOf("day"));

    const currentTime = writable(0);

    const showCallBar = writable(false);

    const showCallee = writable(false);

    const calleeName = writable(null);

    const calleeID = writable(null);

    const callerID = writable(null);

    const callerSignal = writable(null);

    const showCaller = writable(false);

    const callerName = writable(false);

    const userGames = writable(null);

    const leaderBoard = writable(null);

    const gameBoard = writable(null);

    const gameHistory = writable(null);

    const gamePref = writable(null);

    const allChats = writable(null);

    const smallPopUp = writable(false);

    const bigPopUp = writable(false);

    const viewCreateGame = writable(false);

    const viewJoinGame = writable(false);

    const viewGameList = writable(false);

    const showLogin = writable(false);

    window.onbeforeunload = async function() {

        const indexes = {};

        await currUser.update(state => {
            indexes.user = state;
            return state;
        });

        await page.update(state => {
            indexes.page = state;
            return state;
        });

        await gameTab.update(state => {
            indexes.tab = state;
            return state;
        });

        await gameBoard.update(state => {
            indexes.board = state;
            return state;
        });

        await gameHistory.update(state => {
            indexes.history = state;
            return state;
        });

        await gamePref.update(state => {
            indexes.pref = state;
            return state;
        });

        await allChats.update(state => {
            indexes.chats = state;
            return state;
        });

        await userGames.update(state => {
            indexes.games = state;
            return state;
        });

        await leaderBoard.update(state => {
            indexes.league = state;
            return state;
        });

        await sessionStorage.setItem('idx', JSON.stringify(indexes));
    };

    window.onload = async function() {

        if (sessionStorage.getItem('idx') != null) {

            const indexes = await JSON.parse(sessionStorage.getItem('idx'));
                
            await currUser.set(indexes.user);

            await leaderBoard.set(indexes.league);
            
            if(indexes.board == null)
                await gameBoard.set(null);
            
            if(indexes.board != null)
                await gameBoard.set(new Board(indexes.board.board, null));

            await gameHistory.set(indexes.history);

            await gamePref.set(indexes.pref);

            await allChats.set(indexes.chats);

            await userGames.set(indexes.games);

            await gameTab.set(indexes.tab);

            await page.set(indexes.page);

            sessionStorage.removeItem('idx');
        }
    };

    class Board {

        constructor(state, inverted) {

            let myColor, otherColor;

            currUser.update(state => {
                if(state != null) {
                    myColor = state.gamePref.myColor;
                    otherColor = state.gamePref.otherColor;
                } else {
                    myColor = "#ffffff";
                    otherColor = "#000000";
                }
                return state;
            });

            if(state == null && !inverted) {

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
                                this.board[i][j] = new Piece(i, j, otherColor, k, null);
                                
                            else 
                                this.board[i][j] = new Piece(i, j, myColor, k, null);

                            k++;
                        }
                    }
                }

            } else if(state != null && inverted == null) {

                this.board = [];

                let i, j;

                for(i = 0; i < 8; i++) {

                    this.board[i] = [];

                    for(j = 0; j < 8; j++) {

                        if(state[i][j] != null) {
                            this.board[i][j] = new Piece(i, j, state[i][j].side, state[i][j].id, state[i][j].stack);
                        } else {
                            this.board[i][j] = null;
                        }
                    }
                }

            } else if(state == null && inverted) {

                this.board = [];

                let i, j, k = 23;

                for(i = 0; i < 8; i++) {

                    this.board[i] = [];

                    for(j = 0; j < 8; j++) {

                        let even = (i % 2 == 0) && (j % 2 == 0);
                        let odd = (i % 2 != 0) && (j % 2 != 0);
                
                        if(even || odd || i == 3 || i == 4) {
                        
                            this.board[i][j] = null;

                        } else  {

                            if(0 <= i && i <= 2)
                                this.board[i][j] = new Piece(i, j, otherColor, k, null);
                                
                            else 
                                this.board[i][j] = new Piece(i, j, myColor, k, null);

                            k--;
                        }
                    }
                }
            }
        }

        saveBoardState() {

    		let state = [];
    		let i, j;

    		for(i = 0; i < 8; i++) {
    			state[i] = [];
    			for(j = 0; j < 8; j++) {
                    if(this.board[i][j] != null) {
                        state[i][j] = {};
                        state[i][j].stack = this.board[i][j].stack;
                        state[i][j].side = this.board[i][j].side;
                        state[i][j].id = this.board[i][j].id;
                    }
    				else {
                        state[i][j] = null;
                    }
    			}
    		}

    		return state;
    	}


        takePiece(piece, currPos, yDiff, nextPos) {

            let isTaken = false;
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

            return isTaken;
        }
        

        possibleMoves(piece) {

            let moves = [];
            let move;

            let xPos = piece.getPosition().xPos;
            let yPos = piece.getPosition().yPos;

            if((0 <= xPos - 2 || 0 <= xPos - 1) && (0 <= yPos - 2 || 0 <= yPos - 1) && (xPos - 2 <= 7 || xPos - 1 <= 7) && (yPos - 2 <= 7 || yPos - 1 <= 7)) {
                //console.log("Upper Left");
                if(this.board[xPos - 1][yPos - 1] == null) {
                    move = {
                        x: xPos - 1,
                        y: yPos - 1 
                    };

                    moves.push(move);
                    //console.log("Upper Left");
                } else if(this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side != piece.side && this.board[xPos - 2][yPos - 2] == null) {
                    move = {
                        x: xPos - 2,
                        y: yPos - 2 
                    };

                    moves.push(move);
                }
            }

            if((0 <= xPos + 2 || 0 <= xPos + 1) && (0 <= yPos + 2 || 0 <= yPos + 1) && (xPos + 2 <= 7 || xPos + 1 <= 7) && (yPos + 2 <= 7 || yPos + 1 <= 7)) {
                //console.log("Lower Right");
                if(this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                    move = {
                        x: xPos + 2,
                        y: yPos + 2 
                    };

                    moves.push(move);
                    //console.log("Lower Right");
                } else if(this.board[xPos + 1][yPos + 1] == null && piece.stack > 1) {
                    move = {
                        x: xPos + 1,
                        y: yPos + 1 
                    };

                    moves.push(move);
                }
            }

            if((0 <= xPos - 2 || 0 <= xPos - 1) && (0 <= yPos + 2 || 0 <= yPos + 1) && (xPos - 2 <= 7 || xPos - 1 <= 7) && (yPos + 2 <= 7 || yPos + 1 <= 7)) {
                //console.log("Upper Right");
                if(this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                    move = {
                        x: xPos - 2,
                        y: yPos + 2 
                    };

                    moves.push(move);
                    //console.log("Upper Right");
                } else if(this.board[xPos - 1][yPos + 1] == null) {
                    move = {
                        x: xPos - 1,
                        y: yPos + 1 
                    };

                    moves.push(move);
                }
            }

            if((0 <= xPos + 2 || 0 <= xPos + 1) && (0 <= yPos - 2 || 0 <= yPos - 1) && (xPos + 2 <= 7 || xPos + 1 <= 7) && (yPos - 2 <= 7 || yPos - 1 <= 7)) {
                //console.log("Lower Left");
                if(this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                    move = {
                        x: xPos + 2,
                        y: yPos - 2 
                    };

                    moves.push(move);
                    //console.log("Lower Left");
                } else if(this.board[xPos + 1][yPos - 1] == null && piece.stack > 1) {
                    move = {
                        x: xPos + 1,
                        y: yPos - 1 
                    };

                    moves.push(move);
                }
            }
            
            return moves;
        }


        isMoveLegal(piece, nextPos) {

            let myColor, otherColor;

            currUser.update(state => {
                if(state != null) {
                    myColor = state.gamePref.myColor;
                    otherColor = state.gamePref.otherColor;
                } else {
                    myColor = "#ffffff";
                    otherColor = "#000000";
                }
                return state;
            });

            let legal = false;

            let currPos = piece.getPosition();

            console.log(nextPos.isEmpty);
            console.log(piece.side);

            if((piece.side == "#ffffff" || piece.side == myColor) && nextPos.isEmpty) {

                console.log(currPos.xPos + ", " + currPos.yPos + " --> " + nextPos.xPos + ", " + nextPos.yPos);

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

            if((piece.side == "#000000" || piece.side == otherColor) && nextPos.isEmpty) {

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

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                        //console.log(nextPos.xPos + ", " + nextPos.yPos);
                        legal = true;
                    }
                        

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

            let myColor, otherColor;

            currUser.update(state => {
                if(state != null) {
                    myColor = state.gamePref.myColor;
                    otherColor = state.gamePref.otherColor;
                } else {
                    myColor = "#ffffff";
                    otherColor = "#000000";
                }
                return state;
            });

            let moved = false, remove = null;

            if(this.isMoveLegal(piece, nextPos)) {

                remove = this.scanBoard(piece, nextPos);

                let newPiece = new Piece(nextPos.xPos, nextPos.yPos, piece.side, piece.id, piece.stack);

                if(newPiece.side == myColor || newPiece.side == "#ffffff") {
                    if(nextPos.xPos == 0 && (newPiece.side == myColor || newPiece.side == "#ffffff") && newPiece.stack == 1) 
                        newPiece.incrementStack();
                } 
                
                if(newPiece.side == otherColor || newPiece.side == "#000000") {
                    if(nextPos.xPos == 0 && (newPiece.side == otherColor || newPiece.side == "#000000") && newPiece.stack == 1) 
                        newPiece.incrementStack();
                }

                this.board[nextPos.xPos][nextPos.yPos] = newPiece;
                
                let currPos = piece.getPosition(); 

                this.board[currPos.xPos][currPos.yPos] = null;

                moved = true;
            }

            return { move: moved, id: remove };
        } 

        scanBoard(piece, nextPos) {

            let i, j;

            let remove = null;

            for(i = 0; i < 8; i++) {
                for(j = 0; j < 8; j++) {
                    if(this.board[i][j] != null && this.board[i][j].id != piece.id && this.board[i][j].side == piece.side) {
                        if(this.checkPiece(this.board[i][j], piece, nextPos)) {
                            remove = piece.id;
                            break;
                        }
                    }
                }
            }

            return remove;
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


        removePiece(piece) {
            let xPos = piece.getPosition().xPos;
            let yPos = piece.getPosition().yPos;

            this.board[xPos][yPos] = null;
        }


        otherPlayerMove(piece, xDiff, yDiff) {

            let mySide;
            
            gamePref.update(state => {
                mySide = state.side;
                return state;
            });

            let xPos = piece.getPosition().xPos;
            let yPos = piece.getPosition().yPos;

            let nextPosX = xPos + xDiff;
            let nextPosY = yPos + yDiff;

            //console.log(xPos + ", " + yPos + " --> " + nextPosX+ ", " + nextPosY);
            //console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

            let newPiece = new Piece(nextPosX, nextPosY, piece.side, piece.id, piece.stack);

            if(newPiece.side == mySide) {

                if(nextPosX == 0 && newPiece.side == "white" && newPiece.stack == 1) 
                    newPiece.incrementStack();
            } 
            
            if(newPiece.side == mySide) {

                if(nextPosX == 0 && newPiece.side == "black" && newPiece.stack == 1) 
                    newPiece.incrementStack();
            }

            this.board[nextPosX][nextPosY] = newPiece;

            if(xDiff == 2 && yDiff == 2) {

                nextPosX = xPos + (xDiff / 2);
                nextPosY = yPos + (yDiff / 2);

                this.board[nextPosX][nextPosY] = null;
            }

            this.board[xPos][yPos] = null;
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

        getPieceFromId(id) {

            let i, j;

            let piece;

            for(i = 0; i < 8; i++) {
                for(j = 0; j < 8; j++) {
                    if(this.board[i][j] != null && this.board[i][j].id == id) {
                        piece = this.board[i][j];
                        break;
                    }
                }
            }

            return piece;
        }

        getBoard() {
            return this.board;
        }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
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

            currUser.update(state => {
                if(state != null)
                    load.id = state.email;
                return state;
            });

            const url = env.funcs + load.func;
            load = new URLSearchParams(load).toString();

            fetch(url, {
                method: 'POST',
                body: load,
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
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

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    let request, userEmail, userName;

    function getAllChats() {

        currUser.update(state => {
            userEmail = state.email;
            return state;
        });

        request = {
            func: "retrieveUserChats",
            email: userEmail
        };

        invokeFunction(request).then((response) => {
            console.log(response);
            if(response.msg != null) {
                allChats.set(response.msg);

                allChats.update(state => {
                    if(state.length > 1)
                        state = state.sort((a,b) => new Moment(a.history[a.history.length - 1].date).format("YYYYMMDD, HH:mm") - new Moment(b.history[b.history.length - 1].date).format("YYYYMMDD, HH:mm"));
                    console.log(state);
                    return state;
                });
            } else {
                console.log(response.err);
                loading = false;
            }
        }).catch((error) => {
            console.log(error);
            loading = false;
        });
    }

    function getLeagueTable() {

        currUser.update(state => {
            userName = state.name;
            return state;
        });

        request = {
            func: "checkersLeague",
            name: userName
        };

        invokeFunction(request).then((response) => {
            console.log(response);
            if(response.msg != null) {
                leaderBoard.set(response.msg.arr);

                currUser.update(state => {
                    state.position = response.msg.pos;
                    return state;
                });
            } else {
                console.log(response.err);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    function getUserGames() {

        currUser.update(state => {
            userEmail = state.email;
            return state;
        });

        request = {
            func: "retrieveUserGames",
            email: userEmail
        };

        invokeFunction(request).then((response) => {
            console.log(response);
            if(response.msg != null) {

                let games = response.msg;
                
                userGames.update(state => {
                    state = [];
                    for(let i = 0; i < games.length; i++) {
                        if(games[i].finished)
                            state.push(games[i]);
                        else
                            state.unshift(games[i]);
                    }
                    return state;
                });
                
            } else {
                console.log(response.err);
                loading = false;
            }
        }).catch((error) => {
            console.log(error);
            loading = false;
        });
    }

    function blink_text() {
        window.$('.blink').fadeOut(1000);
        window.$('.blink').fadeIn(1000);
    }

    /* src/Components/typeIndicator.svelte generated by Svelte v3.22.3 */

    const file = "src/Components/typeIndicator.svelte";

    function create_fragment(ctx) {
    	let svg;
    	let g;
    	let circle0;
    	let circle1;
    	let circle2;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			attr_dev(circle0, "class", "dot svelte-16rctq0");
    			attr_dev(circle0, "cx", "3");
    			attr_dev(circle0, "cy", "3");
    			attr_dev(circle0, "r", "3");
    			add_location(circle0, file, 2, 2, 134);
    			attr_dev(circle1, "class", "dot svelte-16rctq0");
    			attr_dev(circle1, "cx", "12");
    			attr_dev(circle1, "cy", "3");
    			attr_dev(circle1, "r", "3");
    			add_location(circle1, file, 3, 2, 179);
    			attr_dev(circle2, "class", "dot svelte-16rctq0");
    			attr_dev(circle2, "cx", "21");
    			attr_dev(circle2, "cy", "3");
    			attr_dev(circle2, "r", "3");
    			add_location(circle2, file, 4, 2, 225);
    			add_location(g, file, 1, 1, 128);
    			attr_dev(svg, "id", "typing_bubble");
    			attr_dev(svg, "data-name", "typing bubble");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "6");
    			attr_dev(svg, "viewBox", "0 0 24 6");
    			add_location(svg, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, circle0);
    			append_dev(g, circle1);
    			append_dev(g, circle2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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

    function instance($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TypeIndicator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TypeIndicator", $$slots, []);
    	return [];
    }

    class TypeIndicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TypeIndicator",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/Components/loader.svelte generated by Svelte v3.22.3 */

    const file$1 = "src/Components/loader.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "loader svelte-1wwoatl");
    			add_location(div0, file$1, 1, 4, 54);
    			attr_dev(div1, "id", "signup-loader");
    			attr_dev(div1, "class", "loader-container svelte-1wwoatl");
    			add_location(div1, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
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

    function instance$1($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Loader", $$slots, []);
    	return [];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/Components/audioPlayer.svelte generated by Svelte v3.22.3 */

    const file$2 = "src/Components/audioPlayer.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let p;
    	let t0;

    	let t1_value = (/*$callerName*/ ctx[0] != null
    	? /*$callerName*/ ctx[0]
    	: /*$calleeName*/ ctx[1]) + "";

    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let audio;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text("On Call With ");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(/*$currentTime*/ ctx[2]);
    			t4 = space();
    			audio = element("audio");
    			attr_dev(p, "id", "time");
    			attr_dev(p, "class", "svelte-8olr33");
    			add_location(p, file$2, 10, 4, 284);
    			attr_dev(audio, "id", "audio");
    			audio.autoplay = true;
    			audio.controls = true;
    			audio.hidden = true;
    			attr_dev(audio, "class", "svelte-8olr33");
    			add_location(audio, file$2, 11, 4, 383);
    			attr_dev(div, "id", "backplayer");
    			attr_dev(div, "class", "svelte-8olr33");
    			add_location(div, file$2, 9, 0, 231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(div, t4);
    			append_dev(div, audio);
    			if (remount) dispose();
    			dispose = listen_dev(div, "click", /*enlargePlayer*/ ctx[3], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$callerName, $calleeName*/ 3 && t1_value !== (t1_value = (/*$callerName*/ ctx[0] != null
    			? /*$callerName*/ ctx[0]
    			: /*$calleeName*/ ctx[1]) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$currentTime*/ 4) set_data_dev(t3, /*$currentTime*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
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
    	let $callerName;
    	let $calleeName;
    	let $currentTime;
    	validate_store(callerName, "callerName");
    	component_subscribe($$self, callerName, $$value => $$invalidate(0, $callerName = $$value));
    	validate_store(calleeName, "calleeName");
    	component_subscribe($$self, calleeName, $$value => $$invalidate(1, $calleeName = $$value));
    	validate_store(currentTime, "currentTime");
    	component_subscribe($$self, currentTime, $$value => $$invalidate(2, $currentTime = $$value));

    	function enlargePlayer() {
    		showPlayer.set(false);
    		showCallBar.set(true);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AudioPlayer> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("AudioPlayer", $$slots, []);

    	$$self.$capture_state = () => ({
    		callerName,
    		calleeName,
    		onCall,
    		currentTime,
    		showCallBar,
    		showPlayer,
    		enlargePlayer,
    		$callerName,
    		$calleeName,
    		$currentTime
    	});

    	return [$callerName, $calleeName, $currentTime, enlargePlayer];
    }

    class AudioPlayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AudioPlayer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Components/gameChat.svelte generated by Svelte v3.22.3 */

    const { console: console_1 } = globals;
    const file$3 = "src/Components/gameChat.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	return child_ctx;
    }

    // (253:4) {:else}
    function create_else_block_4(ctx) {
    	let h50;
    	let t1;
    	let h51;

    	const block = {
    		c: function create() {
    			h50 = element("h5");
    			h50.textContent = "There are no Chats to View";
    			t1 = space();
    			h51 = element("h5");
    			h51.textContent = "Create or Join a Game to Chat";
    			attr_dev(h50, "class", "empty svelte-cbh2f5");
    			set_style(h50, "margin-top", "25%");
    			set_style(h50, "text-align", "center");
    			add_location(h50, file$3, 253, 8, 10053);
    			attr_dev(h51, "class", "empty svelte-cbh2f5");
    			set_style(h51, "text-align", "center");
    			add_location(h51, file$3, 254, 8, 10154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h50, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h51, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h50);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h51);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(253:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (178:4) {#if $allChats.length > 0}
    function create_if_block(ctx) {
    	let div0;
    	let t0;
    	let div3;
    	let h4;
    	let button0;
    	let t1;
    	let t2_value = /*chatUser*/ ctx[4].toUpperCase() + "";
    	let t2;
    	let t3;
    	let button1;
    	let t5;
    	let div1;
    	let t6;
    	let article;
    	let t7;
    	let div2;
    	let t8;
    	let button2;
    	let i0;
    	let button2_disabled_value;
    	let t9;
    	let input;
    	let t10;
    	let button3;
    	let i1;
    	let current;
    	let dispose;
    	let each_value_1 = /*$allChats*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (/*$ratio*/ ctx[9] < 1) return create_if_block_8;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);
    	let each_value = /*chatMsgs*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block1 = /*isTyping*/ ctx[2] && create_if_block_2(ctx);
    	let if_block2 = /*$showPlayer*/ ctx[10] && (/*$callerName*/ ctx[11] != null || /*$calleeName*/ ctx[12] != null) && (/*$calleeName*/ ctx[12] == /*chatUser*/ ctx[4] || /*$callerName*/ ctx[11] == /*chatUser*/ ctx[4]) && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div3 = element("div");
    			h4 = element("h4");
    			button0 = element("button");
    			if_block0.c();
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Request Game";
    			t5 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			article = element("article");
    			if (if_block1) if_block1.c();
    			t7 = space();
    			div2 = element("div");
    			if (if_block2) if_block2.c();
    			t8 = space();
    			button2 = element("button");
    			i0 = element("i");
    			t9 = space();
    			input = element("input");
    			t10 = space();
    			button3 = element("button");
    			i1 = element("i");
    			attr_dev(div0, "id", "allChats");
    			attr_dev(div0, "class", "svelte-cbh2f5");
    			add_location(div0, file$3, 178, 8, 5670);
    			attr_dev(button0, "class", "btn btn-dark chatHead svelte-cbh2f5");
    			set_style(button0, "float", "left");
    			set_style(button0, "border-radius", "0");
    			add_location(button0, file$3, 198, 16, 7013);
    			attr_dev(button1, "class", "btn btn-dark chatHead svelte-cbh2f5");
    			set_style(button1, "float", "right");
    			set_style(button1, "border-radius", "0 0.4rem 0 0");
    			add_location(button1, file$3, 207, 16, 7429);
    			set_style(h4, "text-align", "center");
    			set_style(h4, "color", "white");
    			attr_dev(h4, "class", "svelte-cbh2f5");
    			add_location(h4, file$3, 197, 12, 6952);
    			attr_dev(article, "class", "odaMsg svelte-cbh2f5");
    			attr_dev(article, "id", "isTyping");
    			add_location(article, file$3, 235, 16, 8991);
    			attr_dev(div1, "class", "scrollable container svelte-cbh2f5");
    			add_location(div1, file$3, 209, 12, 7569);
    			attr_dev(i0, "class", "fa fa-phone svelte-cbh2f5");
    			add_location(i0, file$3, 246, 20, 9611);
    			attr_dev(button2, "class", "btn btn-light btn-file camera svelte-cbh2f5");
    			button2.disabled = button2_disabled_value = !/*currChat*/ ctx[5].online && !/*$onCall*/ ctx[8];
    			add_location(button2, file$3, 245, 16, 9479);
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "id", "user-msg");
    			attr_dev(input, "class", "form-control svelte-cbh2f5");
    			attr_dev(input, "placeholder", "Type Here");
    			add_location(input, file$3, 248, 16, 9684);
    			attr_dev(i1, "class", "fa fa-paper-plane-o svelte-cbh2f5");
    			add_location(i1, file$3, 249, 73, 9949);
    			attr_dev(button3, "class", "btn btn-light plane svelte-cbh2f5");
    			add_location(button3, file$3, 249, 16, 9892);
    			attr_dev(div2, "class", "input-group mb-3 svelte-cbh2f5");
    			add_location(div2, file$3, 241, 12, 9238);
    			attr_dev(div3, "id", "currChat");
    			attr_dev(div3, "class", "svelte-cbh2f5");
    			add_location(div3, file$3, 196, 8, 6919);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h4);
    			append_dev(h4, button0);
    			if_block0.m(button0, null);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			append_dev(h4, t3);
    			append_dev(h4, button1);
    			append_dev(div3, t5);
    			append_dev(div3, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t6);
    			append_dev(div1, article);
    			if (if_block1) if_block1.m(article, null);
    			/*div1_binding*/ ctx[25](div1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t8);
    			append_dev(div2, button2);
    			append_dev(button2, i0);
    			append_dev(div2, t9);
    			append_dev(div2, input);
    			set_input_value(input, /*message*/ ctx[1]);
    			append_dev(div2, t10);
    			append_dev(div2, button3);
    			append_dev(button3, i1);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*viewStatsOrChats*/ ctx[15], false, false, false),
    				listen_dev(button2, "click", /*callUser*/ ctx[14], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[26]),
    				listen_dev(input, "keyup", /*inputStatus*/ ctx[17], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler*/ ctx[27], false, false, false),
    				listen_dev(button3, "click", /*sendMsg*/ ctx[16], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*viewChat, $allChats, $currUser*/ 8384) {
    				each_value_1 = /*$allChats*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button0, null);
    				}
    			}

    			if ((!current || dirty[0] & /*chatUser*/ 16) && t2_value !== (t2_value = /*chatUser*/ ctx[4].toUpperCase() + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*chatMsgs, $currUser*/ 72) {
    				each_value = /*chatMsgs*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t6);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*isTyping*/ ctx[2]) {
    				if (if_block1) {
    					if (dirty[0] & /*isTyping*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(article, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$showPlayer*/ ctx[10] && (/*$callerName*/ ctx[11] != null || /*$calleeName*/ ctx[12] != null) && (/*$calleeName*/ ctx[12] == /*chatUser*/ ctx[4] || /*$callerName*/ ctx[11] == /*chatUser*/ ctx[4])) {
    				if (if_block2) {
    					if (dirty[0] & /*$showPlayer, $callerName, $calleeName, chatUser*/ 7184) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, t8);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*currChat, $onCall*/ 288 && button2_disabled_value !== (button2_disabled_value = !/*currChat*/ ctx[5].online && !/*$onCall*/ ctx[8])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty[0] & /*message*/ 2 && input.value !== /*message*/ ctx[1]) {
    				set_input_value(input, /*message*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			/*div1_binding*/ ctx[25](null);
    			if (if_block2) if_block2.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(178:4) {#if $allChats.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (185:28) {#if chat.online}
    function create_if_block_10(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "indicator online svelte-cbh2f5");
    			add_location(span, file$3, 185, 32, 6328);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(185:28) {#if chat.online}",
    		ctx
    	});

    	return block;
    }

    // (189:24) {#if chat.history.length > 0}
    function create_if_block_9(ctx) {
    	let p0;
    	let t0_value = /*chat*/ ctx[31].history[/*chat*/ ctx[31].history.length - 1].message + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = getTimeSpan(/*chat*/ ctx[31].history[/*chat*/ ctx[31].history.length - 1].date) + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			set_style(p0, "font-weight", "lighter");
    			set_style(p0, "font-size", "15px");
    			set_style(p0, "text-align", "left");
    			attr_dev(p0, "class", "svelte-cbh2f5");
    			add_location(p0, file$3, 189, 28, 6517);
    			set_style(p1, "font-weight", "lighter");
    			set_style(p1, "font-size", "15px");
    			set_style(p1, "text-align", "right");
    			attr_dev(p1, "class", "svelte-cbh2f5");
    			add_location(p1, file$3, 190, 28, 6661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$allChats*/ 128 && t0_value !== (t0_value = /*chat*/ ctx[31].history[/*chat*/ ctx[31].history.length - 1].message + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*$allChats*/ 128 && t2_value !== (t2_value = getTimeSpan(/*chat*/ ctx[31].history[/*chat*/ ctx[31].history.length - 1].date) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(189:24) {#if chat.history.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (180:12) {#each $allChats as chat}
    function create_each_block_1(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t0;
    	let div_1;
    	let h5;

    	let t1_value = (/*chat*/ ctx[31].priName == /*$currUser*/ ctx[6].name
    	? /*chat*/ ctx[31].secName.toUpperCase()
    	: /*chat*/ ctx[31].priName.toUpperCase()) + "";

    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let dispose;
    	let if_block0 = /*chat*/ ctx[31].online && create_if_block_10(ctx);
    	let if_block1 = /*chat*/ ctx[31].history.length > 0 && create_if_block_9(ctx);

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[24](/*chat*/ ctx[31], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t0 = space();
    			div_1 = element("div");
    			h5 = element("h5");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			attr_dev(img, "alt", "propic");

    			if (img.src !== (img_src_value = /*chat*/ ctx[31].priName == /*$currUser*/ ctx[6].name
    			? "https://api.adorable.io/avatars/285/" + /*chat*/ ctx[31].secEmail + ".png"
    			: "https://api.adorable.io/avatars/285/" + /*chat*/ ctx[31].priEmail + ".png")) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "class", "svelte-cbh2f5");
    			add_location(img, file$3, 181, 20, 5850);
    			set_style(h5, "text-align", "left");
    			set_style(h5, "margin-bottom", "0px");
    			attr_dev(h5, "class", "svelte-cbh2f5");
    			add_location(h5, file$3, 183, 24, 6110);
    			attr_dev(div_1, "class", "chatPrev svelte-cbh2f5");
    			add_location(div_1, file$3, 182, 20, 6062);
    			attr_dev(button, "class", "user btn btn-lg btn-dark svelte-cbh2f5");
    			add_location(button, file$3, 180, 16, 5746);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t0);
    			append_dev(button, div_1);
    			append_dev(div_1, h5);
    			append_dev(h5, t1);
    			append_dev(h5, t2);
    			if (if_block0) if_block0.m(h5, null);
    			append_dev(div_1, t3);
    			if (if_block1) if_block1.m(div_1, null);
    			append_dev(button, t4);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*$allChats, $currUser*/ 192 && img.src !== (img_src_value = /*chat*/ ctx[31].priName == /*$currUser*/ ctx[6].name
    			? "https://api.adorable.io/avatars/285/" + /*chat*/ ctx[31].secEmail + ".png"
    			: "https://api.adorable.io/avatars/285/" + /*chat*/ ctx[31].priEmail + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty[0] & /*$allChats, $currUser*/ 192 && t1_value !== (t1_value = (/*chat*/ ctx[31].priName == /*$currUser*/ ctx[6].name
    			? /*chat*/ ctx[31].secName.toUpperCase()
    			: /*chat*/ ctx[31].priName.toUpperCase()) + "")) set_data_dev(t1, t1_value);

    			if (/*chat*/ ctx[31].online) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					if_block0.m(h5, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*chat*/ ctx[31].history.length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					if_block1.m(div_1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(180:12) {#each $allChats as chat}",
    		ctx
    	});

    	return block;
    }

    // (203:20) {:else}
    function create_else_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Versus Stats");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(203:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (200:20) {#if $ratio < 1}
    function create_if_block_8(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("\r\n                        Back");
    			attr_dev(i, "class", "fa fa-arrow-left svelte-cbh2f5");
    			add_location(i, file$3, 200, 24, 7181);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(200:20) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (223:20) {:else}
    function create_else_block_1(ctx) {
    	let article;
    	let span;
    	let t0_value = /*msg*/ ctx[28].message + "";
    	let t0;
    	let t1;

    	function select_block_type_4(ctx, dirty) {
    		if (/*i*/ ctx[30] < /*chatMsgs*/ ctx[3].length - 1) return create_if_block_6;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_4(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			attr_dev(span, "class", "txtMsg svelte-cbh2f5");
    			add_location(span, file$3, 224, 28, 8414);
    			attr_dev(article, "class", "odaMsg svelte-cbh2f5");
    			add_location(article, file$3, 223, 24, 8360);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, span);
    			append_dev(span, t0);
    			append_dev(article, t1);
    			if_block.m(article, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*chatMsgs*/ 8 && t0_value !== (t0_value = /*msg*/ ctx[28].message + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(article, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(223:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (212:20) {#if msg.msgid == $currUser.email}
    function create_if_block_3(ctx) {
    	let article;
    	let span;
    	let t0_value = /*msg*/ ctx[28].message + "";
    	let t0;
    	let t1;

    	function select_block_type_3(ctx, dirty) {
    		if (/*i*/ ctx[30] < /*chatMsgs*/ ctx[3].length - 1) return create_if_block_4;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			attr_dev(span, "class", "txtMsg svelte-cbh2f5");
    			add_location(span, file$3, 213, 28, 7798);
    			attr_dev(article, "class", "myMsg svelte-cbh2f5");
    			add_location(article, file$3, 212, 24, 7745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, span);
    			append_dev(span, t0);
    			append_dev(article, t1);
    			if_block.m(article, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*chatMsgs*/ 8 && t0_value !== (t0_value = /*msg*/ ctx[28].message + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(article, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(212:20) {#if msg.msgid == $currUser.email}",
    		ctx
    	});

    	return block;
    }

    // (230:28) {:else}
    function create_else_block_2(ctx) {
    	let p;
    	let t_value = getTimeSpan(/*msg*/ ctx[28].date) + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "font-size", "10px");
    			attr_dev(p, "class", "svelte-cbh2f5");
    			add_location(p, file$3, 230, 32, 8796);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*chatMsgs*/ 8 && t_value !== (t_value = getTimeSpan(/*msg*/ ctx[28].date) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(230:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (226:28) {#if i < chatMsgs.length - 1}
    function create_if_block_6(ctx) {
    	let if_block_anchor;
    	let if_block = /*chatMsgs*/ ctx[3][/*i*/ ctx[30] + 1].date != /*chatMsgs*/ ctx[3][/*i*/ ctx[30]].date && create_if_block_7(ctx);

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
    			if (/*chatMsgs*/ ctx[3][/*i*/ ctx[30] + 1].date != /*chatMsgs*/ ctx[3][/*i*/ ctx[30]].date) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(226:28) {#if i < chatMsgs.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (227:32) {#if chatMsgs[i + 1].date != chatMsgs[i].date}
    function create_if_block_7(ctx) {
    	let p;
    	let t_value = getTimeSpan(/*msg*/ ctx[28].date) + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "font-size", "10px");
    			attr_dev(p, "class", "svelte-cbh2f5");
    			add_location(p, file$3, 227, 36, 8632);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*chatMsgs*/ 8 && t_value !== (t_value = getTimeSpan(/*msg*/ ctx[28].date) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(227:32) {#if chatMsgs[i + 1].date != chatMsgs[i].date}",
    		ctx
    	});

    	return block;
    }

    // (219:28) {:else}
    function create_else_block(ctx) {
    	let p;
    	let t_value = getTimeSpan(/*msg*/ ctx[28].date) + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "font-size", "10px");
    			attr_dev(p, "class", "svelte-cbh2f5");
    			add_location(p, file$3, 219, 32, 8180);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*chatMsgs*/ 8 && t_value !== (t_value = getTimeSpan(/*msg*/ ctx[28].date) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(219:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (215:28) {#if i < chatMsgs.length - 1}
    function create_if_block_4(ctx) {
    	let if_block_anchor;
    	let if_block = /*chatMsgs*/ ctx[3][/*i*/ ctx[30] + 1].date != /*chatMsgs*/ ctx[3][/*i*/ ctx[30]].date && create_if_block_5(ctx);

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
    			if (/*chatMsgs*/ ctx[3][/*i*/ ctx[30] + 1].date != /*chatMsgs*/ ctx[3][/*i*/ ctx[30]].date) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(215:28) {#if i < chatMsgs.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (216:32) {#if chatMsgs[i + 1].date != chatMsgs[i].date}
    function create_if_block_5(ctx) {
    	let p;
    	let t_value = getTimeSpan(/*msg*/ ctx[28].date) + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "font-size", "10px");
    			attr_dev(p, "class", "svelte-cbh2f5");
    			add_location(p, file$3, 216, 36, 8016);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*chatMsgs*/ 8 && t_value !== (t_value = getTimeSpan(/*msg*/ ctx[28].date) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(216:32) {#if chatMsgs[i + 1].date != chatMsgs[i].date}",
    		ctx
    	});

    	return block;
    }

    // (211:16) {#each chatMsgs as msg, i}
    function create_each_block(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*msg*/ ctx[28].msgid == /*$currUser*/ ctx[6].email) return create_if_block_3;
    		return create_else_block_1;
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
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(211:16) {#each chatMsgs as msg, i}",
    		ctx
    	});

    	return block;
    }

    // (237:20) {#if isTyping}
    function create_if_block_2(ctx) {
    	let span;
    	let current;
    	const indicator = new TypeIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(indicator.$$.fragment);
    			attr_dev(span, "class", "txtMsg svelte-cbh2f5");
    			attr_dev(span, "id", "isTypingSpan");
    			add_location(span, file$3, 237, 24, 9091);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(indicator, span, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(indicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(indicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(indicator);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(237:20) {#if isTyping}",
    		ctx
    	});

    	return block;
    }

    // (243:16) {#if $showPlayer && ($callerName != null || $calleeName != null) && ($calleeName == chatUser || $callerName == chatUser)}
    function create_if_block_1(ctx) {
    	let current;
    	const player = new AudioPlayer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(player.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(player, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(player, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(243:16) {#if $showPlayer && ($callerName != null || $calleeName != null) && ($calleeName == chatUser || $callerName == chatUser)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div_1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block_4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$allChats*/ ctx[7].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div_1 = element("div");
    			if_block.c();
    			attr_dev(div_1, "id", "chatWindow");
    			attr_dev(div_1, "class", "svelte-cbh2f5");
    			add_location(div_1, file$3, 176, 0, 5607);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div_1, anchor);
    			if_blocks[current_block_type_index].m(div_1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    				if_block.m(div_1, null);
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
    			if (detaching) detach_dev(div_1);
    			if_blocks[current_block_type_index].d();
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

    function getTimeSpan(date) {
    	return moment(date, "YYYYMMDD, HH:mm").fromNow();
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $currSocket;
    	let $currUser;
    	let $allChats;
    	let $onCall;
    	let $peer;
    	let $ratio;
    	let $showPlayer;
    	let $callerName;
    	let $calleeName;
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(22, $currSocket = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(6, $currUser = $$value));
    	validate_store(allChats, "allChats");
    	component_subscribe($$self, allChats, $$value => $$invalidate(7, $allChats = $$value));
    	validate_store(onCall, "onCall");
    	component_subscribe($$self, onCall, $$value => $$invalidate(8, $onCall = $$value));
    	validate_store(peer, "peer");
    	component_subscribe($$self, peer, $$value => $$invalidate(23, $peer = $$value));
    	validate_store(ratio, "ratio");
    	component_subscribe($$self, ratio, $$value => $$invalidate(9, $ratio = $$value));
    	validate_store(showPlayer, "showPlayer");
    	component_subscribe($$self, showPlayer, $$value => $$invalidate(10, $showPlayer = $$value));
    	validate_store(callerName, "callerName");
    	component_subscribe($$self, callerName, $$value => $$invalidate(11, $callerName = $$value));
    	validate_store(calleeName, "calleeName");
    	component_subscribe($$self, calleeName, $$value => $$invalidate(12, $calleeName = $$value));
    	$currSocket.emit("go-online", $currUser.email);
    	let div, autoscroll;
    	let message;
    	let isTyping = false;
    	let currMsg;
    	let chatID, chatMsgs, chatUser, userID;
    	let currChat = $allChats.length > 0 ? $allChats[0] : null;

    	if (currChat != null) {
    		chatID = currChat.id;
    		chatMsgs = currChat.history;

    		chatUser = currChat.priName == $currUser.name
    		? currChat.secName
    		: currChat.priName;

    		userID = currChat.priEmail == $currUser.email
    		? currChat.secEmail
    		: currChat.priEmail;
    	}

    	beforeUpdate(() => {
    		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
    	});

    	afterUpdate(() => {
    		if (autoscroll) div.scrollTo(0, div.scrollHeight);
    	});

    	$currSocket.on("typing", id => {
    		if (id == $currUser.email) $$invalidate(2, isTyping = true);
    	});

    	$currSocket.on("no-typing", id => {
    		if (id == $currUser.email) $$invalidate(2, isTyping = false);
    	});

    	setInterval(
    		function () {
    			if ($allChats != null && $allChats.length > 0) viewChat(currChat, true);
    		},
    		500
    	);

    	function viewChat(chat, refresh) {
    		if (chat != null) {
    			if (screen.width <= 800 && !refresh) {
    				showNavBar.set(false);
    				let allChats = document.getElementById("allChats");
    				allChats.setAttribute("style", "left:-100%");
    				let currChat = document.getElementById("currChat");
    				currChat.setAttribute("style", "left:0;");
    			}

    			$$invalidate(5, currChat = chat);
    			chatID = currChat.id;
    			$$invalidate(3, chatMsgs = currChat.history);

    			$$invalidate(4, chatUser = currChat.priName == $currUser.name
    			? currChat.secName
    			: currChat.priName);

    			userID = currChat.priEmail == $currUser.email
    			? currChat.secEmail
    			: currChat.priEmail;
    		}
    	}

    	function callUser() {
    		if (!$onCall) {
    			console.log("Making call To " + chatUser);
    			calleeName.set(chatUser);
    			calleeID.set(userID);
    			callerName.set($currUser.name);
    			callerID.set($currUser.email);
    			showCallBar.set(true);
    			showCallee.set(true);

    			navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
    				console.log("Creating Peer");
    				setInterval(blink_text, 1000);

    				setTimeout(
    					function () {
    						window.$("#stream").draggable();
    					},
    					1000
    				);

    				peer.set(new SimplePeer({ initiator: true, trickle: false, stream }));

    				$peer.on("signal", data => {
    					if (!$onCall) {
    						console.log("Receiving Signal");

    						$currSocket.emit("call-user", {
    							calleeID: userID,
    							calleeName: chatUser,
    							signal: data,
    							callerName: $currUser.name,
    							callerID: $currUser.email
    						});
    					}
    				});

    				$peer.on("stream", stream => {
    					console.log("Sending Stream");
    					showPlayer.set(true);
    					(showCallBar.set(false), showCallee.set(false));

    					setTimeout(
    						function () {
    							let audio = document.getElementById("audio");
    							audio.srcObject = stream;
    							onCall.set(true);
    						},
    						500
    					);
    				});
    			}).catch(err => {
    				console.log(err);
    			});
    		}
    	}

    	function viewStatsOrChats() {
    		if (screen.width <= 800) {
    			showNavBar.set(true);
    			let allChats = document.getElementById("allChats");
    			allChats.setAttribute("style", "left:0%");
    			let currChat = document.getElementById("currChat");
    			currChat.setAttribute("style", "left:100%;");
    		}
    	}

    	function sendMsg() {
    		if (message != null || message != "") {
    			currMsg = {
    				chatID,
    				userID,
    				func: "saveChat",
    				id: $currUser.email,
    				msg: {
    					msgid: $currUser.email,
    					date: moment().format("YYYYMMDD, HH:mm"),
    					message
    				}
    			};

    			$currSocket.emit("send-msg", currMsg);
    			$$invalidate(1, message = "");
    		}
    	}

    	function inputStatus() {
    		if (message == "") {
    			$currSocket.emit("no-typing", userID);
    		} else {
    			$currSocket.emit("typing", userID);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<GameChat> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameChat", $$slots, []);
    	const click_handler = chat => viewChat(chat, false);

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, div = $$value);
    		});
    	}

    	function input_input_handler() {
    		message = this.value;
    		$$invalidate(1, message);
    	}

    	const keydown_handler = event => event.which === 13 && sendMsg();

    	$$self.$capture_state = () => ({
    		currSocket,
    		currUser,
    		gamePref,
    		allChats,
    		calleeID,
    		calleeName,
    		callerName,
    		showNavBar,
    		showPlayer,
    		peer,
    		showCallee,
    		showCallBar,
    		onCall,
    		callerID,
    		ratio,
    		getAllChats,
    		blink_text,
    		invokeFunction,
    		beforeUpdate,
    		afterUpdate,
    		Indicator: TypeIndicator,
    		Loader,
    		Player: AudioPlayer,
    		div,
    		autoscroll,
    		message,
    		isTyping,
    		currMsg,
    		chatID,
    		chatMsgs,
    		chatUser,
    		userID,
    		currChat,
    		viewChat,
    		callUser,
    		viewStatsOrChats,
    		sendMsg,
    		inputStatus,
    		getTimeSpan,
    		$currSocket,
    		$currUser,
    		$allChats,
    		$onCall,
    		$peer,
    		$ratio,
    		$showPlayer,
    		$callerName,
    		$calleeName
    	});

    	$$self.$inject_state = $$props => {
    		if ("div" in $$props) $$invalidate(0, div = $$props.div);
    		if ("autoscroll" in $$props) autoscroll = $$props.autoscroll;
    		if ("message" in $$props) $$invalidate(1, message = $$props.message);
    		if ("isTyping" in $$props) $$invalidate(2, isTyping = $$props.isTyping);
    		if ("currMsg" in $$props) currMsg = $$props.currMsg;
    		if ("chatID" in $$props) chatID = $$props.chatID;
    		if ("chatMsgs" in $$props) $$invalidate(3, chatMsgs = $$props.chatMsgs);
    		if ("chatUser" in $$props) $$invalidate(4, chatUser = $$props.chatUser);
    		if ("userID" in $$props) userID = $$props.userID;
    		if ("currChat" in $$props) $$invalidate(5, currChat = $$props.currChat);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		div,
    		message,
    		isTyping,
    		chatMsgs,
    		chatUser,
    		currChat,
    		$currUser,
    		$allChats,
    		$onCall,
    		$ratio,
    		$showPlayer,
    		$callerName,
    		$calleeName,
    		viewChat,
    		callUser,
    		viewStatsOrChats,
    		sendMsg,
    		inputStatus,
    		autoscroll,
    		currMsg,
    		chatID,
    		userID,
    		$currSocket,
    		$peer,
    		click_handler,
    		div1_binding,
    		input_input_handler,
    		keydown_handler
    	];
    }

    class GameChat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameChat",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Components/threeD.svelte generated by Svelte v3.22.3 */

    const { console: console_1$1 } = globals;
    const file$4 = "src/Components/threeD.svelte";

    function create_fragment$4(ctx) {
    	let button;
    	let t0;
    	let t1;
    	let div;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(/*currDim*/ ctx[0]);
    			t1 = space();
    			div = element("div");
    			attr_dev(button, "class", "btn btn-primary btn-sm svelte-1jarv8k");
    			add_location(button, file$4, 505, 0, 21013);
    			attr_dev(div, "id", "board");
    			attr_dev(div, "class", "svelte-1jarv8k");
    			add_location(div, file$4, 506, 0, 21100);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*changeDimension*/ ctx[1], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currDim*/ 1) set_data_dev(t0, /*currDim*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $ratio;
    	let $currUser;
    	let $gameBoard;
    	let $gamePref;
    	let $currSocket;
    	validate_store(ratio, "ratio");
    	component_subscribe($$self, ratio, $$value => $$invalidate(13, $ratio = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(14, $currUser = $$value));
    	validate_store(gameBoard, "gameBoard");
    	component_subscribe($$self, gameBoard, $$value => $$invalidate(15, $gameBoard = $$value));
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(16, $gamePref = $$value));
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(17, $currSocket = $$value));
    	let square, boardSquare, size;
    	let numSquares = 8;

    	if ($ratio < 1) {
    		boardSquare = screen.width;
    		square = boardSquare / numSquares;
    		size = boardSquare / 20;
    	} else {
    		boardSquare = 0.9 * screen.height;
    		size = boardSquare / 20;
    		square = boardSquare / numSquares;
    	}

    	document.documentElement.style.setProperty("--boardSquare", boardSquare + "px");
    	let yRotation, currDim, cyHeight;
    	let maxHeight = size / 2;

    	if ($currUser != null) {
    		if ($currUser.gamePref.orient == "2D") {
    			yRotation = 0;
    			currDim = "3D";
    			cyHeight = 0;
    		} else {
    			yRotation = boardSquare;
    			currDim = "2D";
    			cyHeight = maxHeight;
    		}
    	} else {
    		yRotation = 0;
    		currDim = "3D";
    		cyHeight = 0;
    	}

    	let { currPos } = $$props;
    	let { nextPos } = $$props;
    	let lockedPiece = false;
    	let moving = false;
    	let checkers = [];
    	let emptySqs = [];
    	let possibleMoves = [];

    	let board = function (p5) {
    		p5.setup = function () {
    			p5.createCanvas(boardSquare, boardSquare, this.WEBGL);
    		};

    		p5.draw = function () {
    			p5.angleMode(p5.DEGREES);
    			p5.background(255);
    			p5.camera(0, yRotation, boardSquare, 0, 0, 0, 0, 1, 0);
    			p5.translate(-(boardSquare / 2 - square / 2), -(boardSquare / 2 - square / 2));
    			let topLeftX, topLeftY;
    			let topRightX, topRightY;
    			let bottomLeftX, bottomLeftY;
    			let bottomRightY;
    			let xSquare, ySquare;
    			let squareDiv;
    			let currX, currY;
    			topLeftX = (p5.width - boardSquare) / 2 + square / 2;
    			topLeftY = (p5.height - boardSquare) / 2 + square / 2;
    			currX = topLeftX;
    			currY = topLeftY;
    			topRightX = topLeftX * 15;
    			topRightY = topLeftY;
    			bottomLeftX = topLeftX;
    			bottomLeftY = topLeftY * 15;
    			bottomRightY = bottomLeftY;

    			if (yRotation >= boardSquare) {
    				//console.log("TopLeftX: " + topLeftX + ", TopLeftY: " + topLeftY);
    				topLeftX = Math.floor(topLeftX * 4.074);

    				topLeftY = Math.floor(topLeftY * 5.092);
    				currX = topLeftX;
    				currY = topLeftY;

    				//console.log("TopLeftX: " + topLeftX + ", TopLeftY: " + topLeftY);
    				//console.log("TopRightX: " + topRightX + ", TopRightY: " + topRightY);
    				topRightX = Math.floor(topRightX * 0.762);

    				topRightY = topLeftY;

    				//console.log("TopRightX: " + topRightX + ", TopRightY: " + topRightY);
    				//console.log("bottomLeftX: " + bottomLeftX + ", bottomLeftY: " + bottomLeftY);
    				bottomLeftX = Math.floor(bottomLeftX * 2.314);

    				bottomLeftY = Math.floor(bottomLeftY * 0.782);

    				bottomRightY = bottomLeftY;

    				//console.log("bottomRightX: " + bottomRightX + ", bottomRightY: " + bottomRightY);
    				xSquare = (topRightX - topLeftX) / 7;

    				ySquare = (bottomRightY - topRightY) / 7;
    				squareDiv = (topLeftX - bottomLeftX) / 7;
    			}

    			let count = 0;

    			for (let i = 0; i < numSquares; i++) {
    				for (let j = 0; j < numSquares; j++) {
    					let even = i % 2 == 0 && j % 2 == 0;
    					let odd = i % 2 != 0 && j % 2 != 0;

    					if (even || odd) {
    						p5.fill("wheat");
    						p5.box(square, square, 10);
    					} else {
    						if (possibleMoves.length > 0) {
    							p5.fill("brown");

    							if (!moving) {
    								for (let k = 0; k < possibleMoves.length; k++) {
    									if (possibleMoves[k].x == i && possibleMoves[k].y == j) {
    										p5.fill("skyblue");
    										break;
    									}
    								}
    							}
    						} else {
    							p5.fill("brown");
    						}

    						p5.box(square, square, 10);

    						if (!$gameBoard.isEmpty(i, j)) {
    							if (moving && currPos != null && nextPos != null && i == nextPos.xPos && j == nextPos.yPos) {
    								let id = $gameBoard.getId(i, j);
    								let prevXPos = checkers[id].x;
    								let prevYPos = checkers[id].y;

    								if (prevXPos > currX && prevYPos > currY) {
    									console.log("MOVING PIECE top left");
    									p5.push();
    									p5.translate(prevXPos - currX, prevYPos - currY);
    									p5.rotateX(90);
    									if ($gameBoard.getSide(i, j) == "#000000") p5.stroke(255);
    									p5.fill("gold");
    									p5.cylinder(size, cyHeight);
    									p5.pop();
    									p5.push();
    									p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 1);
    									p5.strokeWeight(2);

    									if ($gameBoard.getSide(i, j) == "#000000") {
    										p5.stroke("white");
    									} else {
    										p5.stroke("#000000");
    									}

    									p5.fill("gold");
    									p5.circle(0, 0, size * 2);
    									p5.pop();
    									checkers[id] = {};
    									checkers[id].x = prevXPos - 2;
    									checkers[id].y = prevYPos - 2;
    									checkers[id].i = i;
    									checkers[id].j = j;
    									checkers[id].r = size * 1.5;
    								} else if (prevXPos > currX && prevYPos < currY) {
    									console.log("MOVING PIECE bottom left");
    									p5.push();
    									p5.translate(currX - prevXPos, currY - prevYPos);
    									p5.rotateX(90);
    									if ($gameBoard.getSide(i, j) == "#000000") p5.stroke(255);
    									p5.fill("gold");
    									p5.cylinder(size, cyHeight);
    									p5.pop();
    									p5.push();
    									p5.translate(currX - prevXPos, currY - prevYPos, maxHeight + 1);
    									p5.strokeWeight(2);

    									if ($gameBoard.getSide(i, j) == "#000000") {
    										p5.stroke("white");
    									} else {
    										p5.stroke("#000000");
    									}

    									p5.fill("gold");
    									p5.circle(0, 0, size * 2);
    									p5.pop();
    									checkers[id] = {};
    									checkers[id].x = prevXPos - 2;
    									checkers[id].y = prevYPos + 2;
    									checkers[id].i = i;
    									checkers[id].j = j;
    									checkers[id].r = size * 1.5;
    								} else if (prevXPos < currX && prevYPos > currY) {
    									console.log("MOVING PIECE top right");
    									p5.push();
    									p5.translate(prevXPos - currX, prevYPos - currY);
    									p5.rotateX(90);
    									if ($gameBoard.getSide(i, j) == "#000000") p5.stroke(255);
    									p5.fill("gold");
    									p5.cylinder(size, cyHeight);
    									p5.pop();
    									p5.push();
    									p5.translate(prevXPos - currX, prevYPos - currY, maxHeight + 1);
    									p5.strokeWeight(2);

    									if ($gameBoard.getSide(i, j) == "#000000") {
    										p5.stroke("white");
    									} else {
    										p5.stroke("#000000");
    									}

    									p5.fill("gold");
    									p5.circle(0, 0, size * 2);
    									p5.pop();
    									checkers[id] = {};
    									checkers[id].x = prevXPos + 2;
    									checkers[id].y = prevYPos - 2;
    									checkers[id].i = i;
    									checkers[id].j = j;
    									checkers[id].r = size * 1.5;
    								} else if (prevXPos < currX && prevYPos < currY) {
    									console.log("MOVING PIECE bottom right");
    									p5.push();
    									p5.translate(currX - prevXPos, currY - prevYPos);
    									p5.rotateX(90);
    									if ($gameBoard.getSide(i, j) == "#000000") p5.stroke(255);
    									p5.fill("gold");
    									p5.cylinder(size, cyHeight);
    									p5.pop();
    									p5.push();
    									p5.translate(currX - prevXPos, currY - prevYPos, maxHeight + 1);
    									p5.strokeWeight(2);

    									if ($gameBoard.getSide(i, j) == "#000000") {
    										p5.stroke("white");
    									} else {
    										p5.stroke("#000000");
    									}

    									p5.fill("gold");
    									p5.circle(0, 0, size * 2);
    									p5.pop();
    									checkers[id] = {};
    									checkers[id].x = prevXPos + 2;
    									checkers[id].y = prevYPos + 2;
    									checkers[id].i = i;
    									checkers[id].j = j;
    									checkers[id].r = size * 1.5;
    								} else {
    									console.log("STOP moving");
    									moving = false;
    									$$invalidate(3, nextPos = null);
    								}
    							} else {
    								let xCurrPos;
    								let yCurrPos;

    								if (currPos != null) {
    									xCurrPos = currPos.getPosition().xPos;
    									yCurrPos = currPos.getPosition().yPos;
    								}

    								p5.push();
    								p5.rotateX(90);
    								if ($gameBoard.getSide(i, j) == "#000000") p5.stroke(255);
    								if (currPos != null && i == xCurrPos && j == yCurrPos) p5.fill("gold"); else p5.fill($gameBoard.getSide(i, j));
    								p5.cylinder(size, cyHeight);
    								p5.pop();
    								p5.push();
    								p5.translate(0, 0, maxHeight + 1);
    								p5.strokeWeight(2);

    								if ($gameBoard.getSide(i, j) == "#000000") {
    									p5.stroke("white");
    								} else {
    									p5.stroke("#000000");
    								}

    								if (currPos != null && i == xCurrPos && j == yCurrPos) p5.fill("gold"); else p5.fill($gameBoard.getSide(i, j));
    								p5.circle(0, 0, size * 2);
    								p5.pop();
    								let id = $gameBoard.getId(i, j);
    								checkers[id] = {};
    								checkers[id].x = currX;
    								checkers[id].y = currY;
    								checkers[id].i = i;
    								checkers[id].j = j;
    								checkers[id].r = size * 1.5;
    							}
    						} else {
    							emptySqs[count] = {};
    							emptySqs[count].x = currX;
    							emptySqs[count].y = currY;
    							emptySqs[count].i = i;
    							emptySqs[count].j = j;
    							emptySqs[count].r = size * 1.5;
    							count++;
    						}
    					}

    					p5.translate(square, 0);
    					if (yRotation < boardSquare) currX += square; else currX += xSquare;
    				}

    				if (yRotation < boardSquare) {
    					currX = topLeftX;
    					currY += square;
    				} else {
    					topLeftX -= squareDiv;
    					topRightX += squareDiv;
    					xSquare = (topRightX - topLeftX) / 7;
    					currX = topLeftX;
    					currY += ySquare;
    				}

    				p5.translate(-(square * 8), square);
    			}
    		};

    		p5.mousePressed = function () {
    			//console.log(this.mouseX + ", " + this.mouseY);
    			//console.log(checkers);
    			for (let i = 0; i < emptySqs.length; i++) {
    				let dist = p5.dist(this.mouseX, this.mouseY, emptySqs[i].x, emptySqs[i].y);

    				if ($gamePref != null) {
    					if (dist < emptySqs[i].r && $gameBoard.isEmpty(emptySqs[i].i, emptySqs[i].j) && currPos != null && $gamePref.rangeMoves == $gamePref.numMoves && $gamePref.currPlayer == $gamePref.side) {
    						console.log("Empty Square at: " + emptySqs[i].i + ", " + emptySqs[i].j);
    						$$invalidate(3, nextPos = new Position(emptySqs[i].i, emptySqs[i].j, "E"));
    						let res = $gameBoard.doMove(currPos, nextPos);
    						console.log(res.move);
    						gameBoard.set($gameBoard);

    						if (res.move) {
    							moving = true;

    							gamePref.update(state => {
    								state.numMoves += 1;
    								state.rangeMoves += 1;
    								state.myMoves += 1;
    								return state;
    							});

    							let pieceInfo = {
    								id: $gameBoard.getId(emptySqs[i].i, emptySqs[i].j),
    								xDiff: currPos.getPosition().xPos - nextPos.xPos,
    								yDiff: currPos.getPosition().yPos - nextPos.yPos,
    								remove: res.id,
    								gameID: $gamePref.gameID,
    								oppID: $gamePref.oppID
    							};

    							$currSocket.emit("piece-move", pieceInfo);
    							$gamePref.states.push($gameBoard.saveBoardState());
    							$$invalidate(2, currPos = $gameBoard.getPiece(nextPos.xPos, nextPos.yPos));
    							possibleMoves = $gameBoard.possibleMoves(currPos);
    							console.log(possibleMoves);
    						}

    						break;
    					}
    				} else {
    					if (dist < emptySqs[i].r && $gameBoard.isEmpty(emptySqs[i].i, emptySqs[i].j) && currPos != null) {
    						console.log("Empty Square at: " + emptySqs[i].i + ", " + emptySqs[i].j);
    						$$invalidate(3, nextPos = new Position(emptySqs[i].i, emptySqs[i].j, "E"));
    						let res = $gameBoard.doMove(currPos, nextPos);
    						console.log(res.move);
    						gameBoard.set($gameBoard);

    						if (res.move) {
    							moving = true;
    							$$invalidate(2, currPos = $gameBoard.getPiece(nextPos.xPos, nextPos.yPos));
    							possibleMoves = $gameBoard.possibleMoves(currPos);
    							console.log(possibleMoves);
    						}

    						break;
    					}
    				}
    			}

    			for (let i = 0; i < checkers.length; i++) {
    				//console.log(i + ": " + state[i].x + ", " + state[i].y);
    				let dist = p5.dist(this.mouseX, this.mouseY, checkers[i].x, checkers[i].y);

    				//console.log(dist);
    				if ($gamePref != null) {
    					if (dist < checkers[i].r && !$gameBoard.isEmpty(checkers[i].i, checkers[i].j) && $gamePref.currPlayer == $gamePref.side && $gamePref.rangeMoves == $gamePref.numMoves && !$gamePref.paused) {
    						console.log("Clicked Checker at: " + checkers[i].i + ", " + checkers[i].j);
    						$$invalidate(2, currPos = $gameBoard.getPieceFromId(i));
    						possibleMoves = $gameBoard.possibleMoves(currPos);
    						break;
    					}
    				} else {
    					if (dist < checkers[i].r && !$gameBoard.isEmpty(checkers[i].i, checkers[i].j)) {
    						console.log("Clicked Checker at: " + checkers[i].i + ", " + checkers[i].j);
    						$$invalidate(2, currPos = $gameBoard.getPieceFromId(i));
    						possibleMoves = $gameBoard.possibleMoves(currPos);
    						console.log(possibleMoves);
    						break;
    					}
    				}
    			}
    		};
    	};

    	function changeDimension() {
    		let step = maxHeight / (boardSquare / 25);
    		let turn;

    		if (yRotation == 0) {
    			$$invalidate(0, currDim = "2D");

    			turn = setInterval(
    				function () {
    					if (yRotation < boardSquare) {
    						yRotation += 25;
    						cyHeight += step;
    					} else {
    						clearInterval(turn);
    					}
    				},
    				100
    			);
    		} else if (yRotation >= boardSquare) {
    			$$invalidate(0, currDim = "3D");

    			turn = setInterval(
    				function () {
    					if (yRotation > 0) {
    						yRotation -= 25;
    						cyHeight -= step;
    					} else {
    						clearInterval(turn);
    					}
    				},
    				100
    			);
    		}
    	}

    	onMount(function () {
    		let myp5 = new p5(board, "board");
    	});

    	const writable_props = ["currPos", "nextPos"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<ThreeD> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ThreeD", $$slots, []);

    	$$self.$set = $$props => {
    		if ("currPos" in $$props) $$invalidate(2, currPos = $$props.currPos);
    		if ("nextPos" in $$props) $$invalidate(3, nextPos = $$props.nextPos);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		gameBoard,
    		gamePref,
    		currSocket,
    		currUser,
    		ratio,
    		spring,
    		Position,
    		square,
    		boardSquare,
    		size,
    		numSquares,
    		yRotation,
    		currDim,
    		cyHeight,
    		maxHeight,
    		currPos,
    		nextPos,
    		lockedPiece,
    		moving,
    		checkers,
    		emptySqs,
    		possibleMoves,
    		board,
    		changeDimension,
    		$ratio,
    		$currUser,
    		$gameBoard,
    		$gamePref,
    		$currSocket
    	});

    	$$self.$inject_state = $$props => {
    		if ("square" in $$props) square = $$props.square;
    		if ("boardSquare" in $$props) boardSquare = $$props.boardSquare;
    		if ("size" in $$props) size = $$props.size;
    		if ("numSquares" in $$props) numSquares = $$props.numSquares;
    		if ("yRotation" in $$props) yRotation = $$props.yRotation;
    		if ("currDim" in $$props) $$invalidate(0, currDim = $$props.currDim);
    		if ("cyHeight" in $$props) cyHeight = $$props.cyHeight;
    		if ("maxHeight" in $$props) maxHeight = $$props.maxHeight;
    		if ("currPos" in $$props) $$invalidate(2, currPos = $$props.currPos);
    		if ("nextPos" in $$props) $$invalidate(3, nextPos = $$props.nextPos);
    		if ("lockedPiece" in $$props) lockedPiece = $$props.lockedPiece;
    		if ("moving" in $$props) moving = $$props.moving;
    		if ("checkers" in $$props) checkers = $$props.checkers;
    		if ("emptySqs" in $$props) emptySqs = $$props.emptySqs;
    		if ("possibleMoves" in $$props) possibleMoves = $$props.possibleMoves;
    		if ("board" in $$props) board = $$props.board;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currDim, changeDimension, currPos, nextPos];
    }

    class ThreeD extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { currPos: 2, nextPos: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ThreeD",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*currPos*/ ctx[2] === undefined && !("currPos" in props)) {
    			console_1$1.warn("<ThreeD> was created without expected prop 'currPos'");
    		}

    		if (/*nextPos*/ ctx[3] === undefined && !("nextPos" in props)) {
    			console_1$1.warn("<ThreeD> was created without expected prop 'nextPos'");
    		}
    	}

    	get currPos() {
    		throw new Error("<ThreeD>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currPos(value) {
    		throw new Error("<ThreeD>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextPos() {
    		throw new Error("<ThreeD>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextPos(value) {
    		throw new Error("<ThreeD>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/blurScreen.svelte generated by Svelte v3.22.3 */
    const file$5 = "src/Components/blurScreen.svelte";

    function create_fragment$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "container-fluid svelte-83kxav");
    			add_location(div, file$5, 4, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BlurScreen> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("BlurScreen", $$slots, []);
    	$$self.$capture_state = () => ({ fly, fade });
    	return [];
    }

    class BlurScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlurScreen",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Components/peerPlay.svelte generated by Svelte v3.22.3 */

    const { console: console_1$2 } = globals;

    const file$6 = "src/Components/peerPlay.svelte";

    // (144:0) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*$gamePref*/ ctx[2].paused && /*$gamePref*/ ctx[2].side == /*$gamePref*/ ctx[2].currPlayer && /*$gamePref*/ ctx[2].opp != null && create_if_block_2$1(ctx);
    	let if_block1 = /*$gamePref*/ ctx[2].side == /*$gamePref*/ ctx[2].currPlayer && /*$gamePref*/ ctx[2].numMoves > 0 && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "id", "gameBtn");
    			attr_dev(div, "class", "container svelte-sasgoq");
    			add_location(div, file$6, 144, 4, 3876);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*$gamePref*/ ctx[2].paused && /*$gamePref*/ ctx[2].side == /*$gamePref*/ ctx[2].currPlayer && /*$gamePref*/ ctx[2].opp != null) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$gamePref*/ ctx[2].side == /*$gamePref*/ ctx[2].currPlayer && /*$gamePref*/ ctx[2].numMoves > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(144:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (139:0) {#if $gamePref.finished}
    function create_if_block$1(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1_value = /*$gamePref*/ ctx[2].rangeMoves + "";
    	let t1;
    	let t2;
    	let input;
    	let input_disabled_value;
    	let input_max_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text("Game State at Move: ");
    			t1 = text(t1_value);
    			t2 = space();
    			input = element("input");
    			attr_dev(h2, "id", "rangeBar");
    			attr_dev(h2, "class", "svelte-sasgoq");
    			add_location(h2, file$6, 140, 8, 3579);
    			attr_dev(input, "class", "custom-range svelte-sasgoq");
    			attr_dev(input, "orient", "vertical");
    			input.disabled = input_disabled_value = !/*$gamePref*/ ctx[2].paused;
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", input_max_value = /*$gamePref*/ ctx[2].numMoves);
    			attr_dev(input, "step", "1");
    			add_location(input, file$6, 141, 8, 3653);
    			attr_dev(div, "id", "state");
    			attr_dev(div, "class", "svelte-sasgoq");
    			add_location(div, file$6, 139, 4, 3554);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(div, t2);
    			append_dev(div, input);
    			set_input_value(input, /*$gamePref*/ ctx[2].rangeMoves);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "change", /*viewBoardHistory*/ ctx[4], false, false, false),
    				listen_dev(input, "change", /*input_change_input_handler*/ ctx[14]),
    				listen_dev(input, "input", /*input_change_input_handler*/ ctx[14])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gamePref*/ 4 && t1_value !== (t1_value = /*$gamePref*/ ctx[2].rangeMoves + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$gamePref*/ 4 && input_disabled_value !== (input_disabled_value = !/*$gamePref*/ ctx[2].paused)) {
    				prop_dev(input, "disabled", input_disabled_value);
    			}

    			if (dirty & /*$gamePref*/ 4 && input_max_value !== (input_max_value = /*$gamePref*/ ctx[2].numMoves)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty & /*$gamePref*/ 4) {
    				set_input_value(input, /*$gamePref*/ ctx[2].rangeMoves);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(139:0) {#if $gamePref.finished}",
    		ctx
    	});

    	return block;
    }

    // (146:8) {#if $gamePref.paused && $gamePref.side == $gamePref.currPlayer && $gamePref.opp != null}
    function create_if_block_2$1(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start Game";
    			attr_dev(button, "class", "btn btn-success btn-lg start svelte-sasgoq");
    			add_location(button, file$6, 146, 12, 4024);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*startGame*/ ctx[6], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(146:8) {#if $gamePref.paused && $gamePref.side == $gamePref.currPlayer && $gamePref.opp != null}",
    		ctx
    	});

    	return block;
    }

    // (150:8) {#if $gamePref.side == $gamePref.currPlayer && $gamePref.numMoves > 0}
    function create_if_block_1$1(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Switch Turn";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Save Game";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Forfeit Game";
    			attr_dev(button0, "class", "btn btn-primary btn-lg switch svelte-sasgoq");
    			add_location(button0, file$6, 150, 12, 4218);
    			attr_dev(button1, "class", "btn btn-warning btn-lg save svelte-sasgoq");
    			add_location(button1, file$6, 152, 12, 4324);
    			attr_dev(button2, "class", "btn btn-danger btn-lg forfeit svelte-sasgoq");
    			add_location(button2, file$6, 154, 12, 4435);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button2, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*switchPlayer*/ ctx[5], false, false, false),
    				listen_dev(button1, "click", /*click_handler*/ ctx[15], false, false, false),
    				listen_dev(button2, "click", /*click_handler_1*/ ctx[16], false, false, false)
    			];
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button2);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(150:8) {#if $gamePref.side == $gamePref.currPlayer && $gamePref.numMoves > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let h20;
    	let t0;
    	let i;
    	let t1;
    	let h21;
    	let t2;
    	let t3_value = /*$gamePref*/ ctx[2].numMoves + "";
    	let t3;
    	let t4;
    	let h22;
    	let t5;
    	let t6_value = /*$gamePref*/ ctx[2].timer + "";
    	let t6;
    	let t7;
    	let h40;

    	let t8_value = (/*$gamePref*/ ctx[2].opp != null
    	? /*$gamePref*/ ctx[2].opp
    	: "Waiting for Other Player") + "";

    	let t8;
    	let t9;
    	let t10;
    	let h41;
    	let t11_value = /*$currUser*/ ctx[3].name + "";
    	let t11;
    	let t12;
    	let if_block_anchor;
    	let current;

    	const threed = new ThreeD({
    			props: {
    				currPos: /*currPos*/ ctx[0],
    				nextPos: /*nextPos*/ ctx[1]
    			},
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*$gamePref*/ ctx[2].finished) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h20 = element("h2");
    			t0 = text("Playing: ");
    			i = element("i");
    			t1 = space();
    			h21 = element("h2");
    			t2 = text("Moves: ");
    			t3 = text(t3_value);
    			t4 = space();
    			h22 = element("h2");
    			t5 = text("Timer: ");
    			t6 = text(t6_value);
    			t7 = space();
    			h40 = element("h4");
    			t8 = text(t8_value);
    			t9 = space();
    			create_component(threed.$$.fragment);
    			t10 = space();
    			h41 = element("h4");
    			t11 = text(t11_value);
    			t12 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(i, "class", "fa fa-circle svelte-sasgoq");

    			set_style(i, "color", /*$gamePref*/ ctx[2].currPlayer == /*$gamePref*/ ctx[2].side
    			? /*$currUser*/ ctx[3].gamePref.myColor
    			: /*$currUser*/ ctx[3].gamePref.otherColor);

    			add_location(i, file$6, 125, 26, 3051);
    			attr_dev(h20, "id", "player");
    			attr_dev(h20, "class", "svelte-sasgoq");
    			add_location(h20, file$6, 125, 1, 3026);
    			attr_dev(h21, "id", "moves");
    			attr_dev(h21, "class", "svelte-sasgoq");
    			add_location(h21, file$6, 127, 1, 3204);
    			attr_dev(h22, "id", "time");
    			attr_dev(h22, "class", "svelte-sasgoq");
    			add_location(h22, file$6, 129, 1, 3254);
    			attr_dev(div, "id", "gameStatus");
    			attr_dev(div, "class", "svelte-sasgoq");
    			add_location(div, file$6, 124, 0, 3003);
    			attr_dev(h40, "class", "players svelte-sasgoq");
    			attr_dev(h40, "style", "top:0;%");
    			add_location(h40, file$6, 132, 0, 3306);
    			attr_dev(h41, "class", "players svelte-sasgoq");
    			set_style(h41, "bottom", "0");
    			add_location(h41, file$6, 136, 0, 3464);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h20);
    			append_dev(h20, t0);
    			append_dev(h20, i);
    			append_dev(div, t1);
    			append_dev(div, h21);
    			append_dev(h21, t2);
    			append_dev(h21, t3);
    			append_dev(div, t4);
    			append_dev(div, h22);
    			append_dev(h22, t5);
    			append_dev(h22, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, h40, anchor);
    			append_dev(h40, t8);
    			insert_dev(target, t9, anchor);
    			mount_component(threed, target, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, h41, anchor);
    			append_dev(h41, t11);
    			insert_dev(target, t12, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$gamePref, $currUser*/ 12) {
    				set_style(i, "color", /*$gamePref*/ ctx[2].currPlayer == /*$gamePref*/ ctx[2].side
    				? /*$currUser*/ ctx[3].gamePref.myColor
    				: /*$currUser*/ ctx[3].gamePref.otherColor);
    			}

    			if ((!current || dirty & /*$gamePref*/ 4) && t3_value !== (t3_value = /*$gamePref*/ ctx[2].numMoves + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*$gamePref*/ 4) && t6_value !== (t6_value = /*$gamePref*/ ctx[2].timer + "")) set_data_dev(t6, t6_value);

    			if ((!current || dirty & /*$gamePref*/ 4) && t8_value !== (t8_value = (/*$gamePref*/ ctx[2].opp != null
    			? /*$gamePref*/ ctx[2].opp
    			: "Waiting for Other Player") + "")) set_data_dev(t8, t8_value);

    			const threed_changes = {};
    			if (dirty & /*currPos*/ 1) threed_changes.currPos = /*currPos*/ ctx[0];
    			if (dirty & /*nextPos*/ 2) threed_changes.nextPos = /*nextPos*/ ctx[1];
    			threed.$set(threed_changes);
    			if ((!current || dirty & /*$currUser*/ 8) && t11_value !== (t11_value = /*$currUser*/ ctx[3].name + "")) set_data_dev(t11, t11_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(threed.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(threed.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t9);
    			destroy_component(threed, detaching);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(h41);
    			if (detaching) detach_dev(t12);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $gamePref;
    	let $currSocket;
    	let $currUser;
    	let $gameBoard;
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(2, $gamePref = $$value));
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(10, $currSocket = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(3, $currUser = $$value));
    	validate_store(gameBoard, "gameBoard");
    	component_subscribe($$self, gameBoard, $$value => $$invalidate(11, $gameBoard = $$value));

    	if ($gamePref.oppID != null && $gamePref.opp == null) {
    		$currSocket.emit("join-game", {
    			gameID: $gamePref.gameID,
    			email: $currUser.email,
    			name: $currUser.name
    		});
    	}

    	let clockTime = $gamePref.time;
    	let lastNumMoves = $gamePref.numMoves;
    	let currPos, nextPos;

    	$currSocket.on("switch-player", gameID => {
    		if (gameID == $gamePref.gameID) {
    			($$invalidate(0, currPos = null), $$invalidate(1, nextPos = null));
    			clearInterval(timeInterval);
    			console.log("Switching Player");

    			gamePref.update(state => {
    				state.timer = state.time;
    				state.currPlayer = state.currPlayer == 0 ? 1 : 0;
    				return state;
    			});

    			console.log($gamePref.currPlayer);
    			timeInterval = setInterval(countDown, 1000);
    		}
    	});

    	$currSocket.on("piece-move", data => {
    		if (data.gameID == $gamePref.gameID && data.oppID == $currUser.email) {
    			console.log(data);
    			if (data.remove != null) $gameBoard.removePiece($gameBoard.getPieceFromId(data.id));
    			let piece = $gameBoard.getPieceFromId(data.id);
    			$gameBoard.otherPlayerMove(piece, data.xDiff, data.yDiff);
    			gameBoard.set($gameBoard);
    			$gamePref.states.push($gameBoard.saveBoardState());

    			gamePref.update(state => {
    				state.numMoves += 1;
    				state.rangeMoves += 1;
    				return state;
    			});
    		}
    	});

    	let timeInterval = setInterval(countDown, 1000);

    	function countDown() {
    		if ($gamePref.rangeMoves == $gamePref.numMoves && $gamePref.paused == false) {
    			//console.log($gamePref.timer);
    			if ($gamePref.timer > 0) {
    				gamePref.update(state => {
    					state.timer -= 1;
    					state.secondsPlayed += 1;
    					return state;
    				});
    			} else {
    				switchPlayer();
    				($$invalidate(0, currPos = null), $$invalidate(1, nextPos = null));
    			}
    		}
    	}

    	function viewBoardHistory() {
    		let state = $gamePref.states[$gamePref.rangeMoves];
    		gameBoard.set(new Board(state, null));
    		setCirclePositions();
    	}

    	function switchPlayer() {
    		$currSocket.emit("switch-player", $gamePref.gameID);
    	}

    	function startGame() {
    		if ($gamePref.side == $gamePref.currPlayer) $currSocket.emit("start-game", $gamePref.gameID);
    	}

    	setInterval(
    		function () {
    			if ($gamePref.numMoves > lastNumMoves) {
    				saveGame(true);
    				lastNumMoves = $gamePref.numMoves;
    			}
    		},
    		300000
    	);

    	function saveGame(auto) {
    		if ($gamePref.side == $gamePref.currPlayer && $gamePref.numMoves > 0) $currSocket.emit("game-save", {
    			gameID: $gamePref.gameID,
    			auto,
    			oppID: $gamePref.oppID
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<PeerPlay> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PeerPlay", $$slots, []);

    	function input_change_input_handler() {
    		$gamePref.rangeMoves = to_number(this.value);
    		gamePref.set($gamePref);
    	}

    	const click_handler = () => saveGame(false);
    	const click_handler_1 = () => saveGame(false);

    	$$self.$capture_state = () => ({
    		Position,
    		ThreeD,
    		Board,
    		spring,
    		writable,
    		invokeFunction,
    		fly,
    		fade,
    		Blur: BlurScreen,
    		gameBoard,
    		gameHistory,
    		gamePref,
    		currSocket,
    		currUser,
    		page,
    		clockTime,
    		lastNumMoves,
    		currPos,
    		nextPos,
    		timeInterval,
    		countDown,
    		viewBoardHistory,
    		switchPlayer,
    		startGame,
    		saveGame,
    		$gamePref,
    		$currSocket,
    		$currUser,
    		$gameBoard
    	});

    	$$self.$inject_state = $$props => {
    		if ("clockTime" in $$props) clockTime = $$props.clockTime;
    		if ("lastNumMoves" in $$props) lastNumMoves = $$props.lastNumMoves;
    		if ("currPos" in $$props) $$invalidate(0, currPos = $$props.currPos);
    		if ("nextPos" in $$props) $$invalidate(1, nextPos = $$props.nextPos);
    		if ("timeInterval" in $$props) timeInterval = $$props.timeInterval;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currPos,
    		nextPos,
    		$gamePref,
    		$currUser,
    		viewBoardHistory,
    		switchPlayer,
    		startGame,
    		saveGame,
    		lastNumMoves,
    		timeInterval,
    		$currSocket,
    		$gameBoard,
    		clockTime,
    		countDown,
    		input_change_input_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class PeerPlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PeerPlay",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Components/singlePlay.svelte generated by Svelte v3.22.3 */

    const file$7 = "src/Components/singlePlay.svelte";

    // (115:1) {:else}
    function create_else_block_1$1(ctx) {
    	let h2;
    	let t;
    	let i;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text("Playing: ");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-circle svelte-43kbcf");

    			set_style(i, "color", /*currPlayer*/ ctx[0] == /*side*/ ctx[6]
    			? "#ffffff"
    			: "#000000");

    			add_location(i, file$7, 115, 27, 2557);
    			attr_dev(h2, "id", "player");
    			attr_dev(h2, "class", "svelte-43kbcf");
    			add_location(h2, file$7, 115, 2, 2532);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    			append_dev(h2, i);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currPlayer*/ 1) {
    				set_style(i, "color", /*currPlayer*/ ctx[0] == /*side*/ ctx[6]
    				? "#ffffff"
    				: "#000000");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(115:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:1) {#if $currUser != null}
    function create_if_block_2$2(ctx) {
    	let h2;
    	let t;
    	let i;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text("Playing: ");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-circle svelte-43kbcf");

    			set_style(i, "color", /*currPlayer*/ ctx[0] == /*side*/ ctx[6]
    			? /*$currUser*/ ctx[5].gamePref.myColor
    			: "#000000");

    			add_location(i, file$7, 113, 27, 2410);
    			attr_dev(h2, "id", "player");
    			attr_dev(h2, "class", "svelte-43kbcf");
    			add_location(h2, file$7, 113, 2, 2385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    			append_dev(h2, i);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currPlayer, $currUser*/ 33) {
    				set_style(i, "color", /*currPlayer*/ ctx[0] == /*side*/ ctx[6]
    				? /*$currUser*/ ctx[5].gamePref.myColor
    				: "#000000");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(113:1) {#if $currUser != null}",
    		ctx
    	});

    	return block;
    }

    // (142:4) {:else}
    function create_else_block$2(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Pause Game";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Switch Turn";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Save Game";
    			attr_dev(button0, "class", "btn btn-warning btn-lg pause svelte-43kbcf");
    			add_location(button0, file$7, 142, 8, 3583);
    			attr_dev(button1, "class", "btn btn-primary btn-lg switch svelte-43kbcf");
    			add_location(button1, file$7, 144, 8, 3695);
    			attr_dev(button2, "class", "btn btn-secondary btn-lg forfeit svelte-43kbcf");
    			add_location(button2, file$7, 146, 8, 3797);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button2, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler_1*/ ctx[24], false, false, false),
    				listen_dev(button1, "click", /*switchPlayer*/ ctx[11], false, false, false),
    				listen_dev(button2, "click", /*click_handler_2*/ ctx[25], false, false, false)
    			];
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button2);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(142:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (131:4) {#if paused}
    function create_if_block$2(ctx) {
    	let button;
    	let t1;
    	let div;
    	let h2;
    	let t2;
    	let t3;
    	let t4;
    	let input;
    	let t5;
    	let if_block_anchor;
    	let dispose;
    	let if_block = /*$currUser*/ ctx[5] == null && /*screenWidth*/ ctx[9] <= 800 && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start Game";
    			t1 = space();
    			div = element("div");
    			h2 = element("h2");
    			t2 = text("Game State at Move: ");
    			t3 = text(/*rangeMoves*/ ctx[1]);
    			t4 = space();
    			input = element("input");
    			t5 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(button, "class", "btn btn-success btn-lg start svelte-43kbcf");
    			add_location(button, file$7, 131, 8, 3008);
    			attr_dev(h2, "id", "rangeBar");
    			attr_dev(h2, "class", "svelte-43kbcf");
    			add_location(h2, file$7, 134, 12, 3149);
    			attr_dev(input, "class", "custom-range svelte-43kbcf");
    			attr_dev(input, "orient", "vertical");
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", /*numMoves*/ ctx[8]);
    			attr_dev(input, "step", "1");
    			add_location(input, file$7, 135, 12, 3217);
    			attr_dev(div, "id", "state");
    			attr_dev(div, "class", "svelte-43kbcf");
    			add_location(div, file$7, 133, 8, 3120);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t2);
    			append_dev(h2, t3);
    			append_dev(div, t4);
    			append_dev(div, input);
    			set_input_value(input, /*rangeMoves*/ ctx[1]);
    			insert_dev(target, t5, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button, "click", /*click_handler*/ ctx[22], false, false, false),
    				listen_dev(input, "change", /*viewBoardHistory*/ ctx[10], false, false, false),
    				listen_dev(input, "change", /*input_change_input_handler*/ ctx[23]),
    				listen_dev(input, "input", /*input_change_input_handler*/ ctx[23])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rangeMoves*/ 2) set_data_dev(t3, /*rangeMoves*/ ctx[1]);

    			if (dirty & /*rangeMoves*/ 2) {
    				set_input_value(input, /*rangeMoves*/ ctx[1]);
    			}

    			if (/*$currUser*/ ctx[5] == null && /*screenWidth*/ ctx[9] <= 800) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t5);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(131:4) {#if paused}",
    		ctx
    	});

    	return block;
    }

    // (139:2) {#if $currUser == null && screenWidth <= 800}
    function create_if_block_1$2(ctx) {
    	let button;
    	let t;
    	let i;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Login/Register ");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-sign-in");
    			add_location(i, file$7, 139, 86, 3516);
    			attr_dev(button, "class", "btn btn-primary btn-lg login svelte-43kbcf");
    			add_location(button, file$7, 139, 3, 3433);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			append_dev(button, i);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*viewEntry*/ ctx[13], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(139:2) {#if $currUser == null && screenWidth <= 800}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div0;
    	let t0;
    	let h20;
    	let t3;
    	let h21;
    	let t6;
    	let h40;
    	let t8;
    	let t9;
    	let h41;

    	let t10_value = (/*$currUser*/ ctx[5] != null
    	? /*$currUser*/ ctx[5].name
    	: "ME") + "";

    	let t10;
    	let t11;
    	let div1;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*$currUser*/ ctx[5] != null) return create_if_block_2$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	const threed = new ThreeD({
    			props: {
    				currPos: /*currPos*/ ctx[2],
    				nextPos: /*nextPos*/ ctx[3]
    			},
    			$$inline: true
    		});

    	function select_block_type_1(ctx, dirty) {
    		if (/*paused*/ ctx[4]) return create_if_block$2;
    		return create_else_block$2;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			h20 = element("h2");
    			h20.textContent = `Moves: ${/*numMoves*/ ctx[8]}`;
    			t3 = space();
    			h21 = element("h2");
    			h21.textContent = `Timer: ${/*time*/ ctx[7]}`;
    			t6 = space();
    			h40 = element("h4");
    			h40.textContent = "Computer";
    			t8 = space();
    			create_component(threed.$$.fragment);
    			t9 = space();
    			h41 = element("h4");
    			t10 = text(t10_value);
    			t11 = space();
    			div1 = element("div");
    			if_block1.c();
    			attr_dev(h20, "id", "moves");
    			attr_dev(h20, "class", "svelte-43kbcf");
    			add_location(h20, file$7, 118, 1, 2660);
    			attr_dev(h21, "id", "time");
    			attr_dev(h21, "class", "svelte-43kbcf");
    			add_location(h21, file$7, 120, 1, 2700);
    			attr_dev(div0, "id", "gameStatus");
    			attr_dev(div0, "class", "svelte-43kbcf");
    			add_location(div0, file$7, 110, 0, 2335);
    			attr_dev(h40, "id", "comp");
    			attr_dev(h40, "class", "players svelte-43kbcf");
    			attr_dev(h40, "style", "top:0;%");
    			add_location(h40, file$7, 123, 0, 2741);
    			attr_dev(h41, "id", "me");
    			attr_dev(h41, "class", "players svelte-43kbcf");
    			set_style(h41, "bottom", "0");
    			add_location(h41, file$7, 127, 0, 2850);
    			attr_dev(div1, "id", "gameBtn");
    			attr_dev(div1, "class", "container svelte-43kbcf");
    			add_location(div1, file$7, 129, 0, 2946);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, h20);
    			append_dev(div0, t3);
    			append_dev(div0, h21);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, h40, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(threed, target, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, h41, anchor);
    			append_dev(h41, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div1, anchor);
    			if_block1.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			}

    			const threed_changes = {};
    			if (dirty & /*currPos*/ 4) threed_changes.currPos = /*currPos*/ ctx[2];
    			if (dirty & /*nextPos*/ 8) threed_changes.nextPos = /*nextPos*/ ctx[3];
    			threed.$set(threed_changes);

    			if ((!current || dirty & /*$currUser*/ 32) && t10_value !== (t10_value = (/*$currUser*/ ctx[5] != null
    			? /*$currUser*/ ctx[5].name
    			: "ME") + "")) set_data_dev(t10, t10_value);

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(threed.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(threed.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_block0.d();
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t8);
    			destroy_component(threed, detaching);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(h41);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div1);
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $gameHistory;
    	let $gamePref;
    	let $currUser;
    	validate_store(gameHistory, "gameHistory");
    	component_subscribe($$self, gameHistory, $$value => $$invalidate(17, $gameHistory = $$value));
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(18, $gamePref = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(5, $currUser = $$value));
    	gameBoard.set(new Board(null, false));
    	let currPlayer = 0, side = 0;
    	let clockTime = 60, timer = 60, time = 60;
    	let numMoves = 0, rangeMoves = 0, lastNumMoves = 0;
    	let currPos, nextPos;
    	let paused = true;
    	let timeInterval = setInterval(countDown, 1000);
    	let screenWidth = screen.width;

    	function countDown() {
    		if (rangeMoves == numMoves && paused == false) {
    			//console.log($gamePref.timer);
    			if (timer > 0) {
    				timer--;
    			} else {
    				clearInterval(timeInterval);
    				$$invalidate(0, currPlayer = currPlayer == 0 ? 1 : 0);
    				timer = clockTime;
    				($$invalidate(2, currPos = null), $$invalidate(3, nextPos = null));
    				lockedPiece = false;
    				timeInterval = setInterval(countDown, 1000);
    			}
    		}
    	}

    	function viewBoardHistory() {
    		gameBoard.set(new Board($gameHistory[$gamePref.rangeMoves], null));
    	}

    	function switchPlayer() {
    		if (side == currPlayer) {
    			clearInterval(timeInterval);
    			$$invalidate(0, currPlayer = currPlayer == 0 ? 1 : 0);
    			timer = clockTime;
    			($$invalidate(2, currPos = null), $$invalidate(3, nextPos = null));
    			lockedPiece = false;
    			timeInterval = setInterval(countDown, 1000);
    		}
    	}

    	function startGame() {
    		if (side == currPlayer) {
    			$$invalidate(4, paused = !paused);
    		}
    	}

    	setInterval(
    		function () {
    			if (numMoves > lastNumMoves) {
    				saveGame();
    				lastNumMoves = numMoves;
    			}
    		},
    		300000
    	);

    	function saveGame(auto) {
    		if (side == currPlayer && numMoves > 0) {
    			clearInterval(timeInterval);
    		}
    	}

    	function viewEntry() {
    		gameTab.set(0);

    		setTimeout(
    			function () {
    				let index = document.getElementById("index");
    				index.setAttribute("style", "top:100%;");
    				let enter = document.getElementById("enter");
    				enter.setAttribute("style", "top:0;");
    			},
    			500
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SinglePlay> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SinglePlay", $$slots, []);
    	const click_handler = () => $$invalidate(4, paused = !paused);

    	function input_change_input_handler() {
    		rangeMoves = to_number(this.value);
    		$$invalidate(1, rangeMoves);
    	}

    	const click_handler_1 = () => $$invalidate(4, paused = !paused);
    	const click_handler_2 = () => saveGame();

    	$$self.$capture_state = () => ({
    		Position,
    		ThreeD,
    		Board,
    		spring,
    		writable,
    		invokeFunction,
    		fly,
    		fade,
    		Blur: BlurScreen,
    		gameBoard,
    		gameHistory,
    		gamePref,
    		currSocket,
    		currUser,
    		page,
    		gameTab,
    		currPlayer,
    		side,
    		clockTime,
    		timer,
    		time,
    		numMoves,
    		rangeMoves,
    		lastNumMoves,
    		currPos,
    		nextPos,
    		paused,
    		timeInterval,
    		screenWidth,
    		countDown,
    		viewBoardHistory,
    		switchPlayer,
    		startGame,
    		saveGame,
    		viewEntry,
    		$gameHistory,
    		$gamePref,
    		$currUser
    	});

    	$$self.$inject_state = $$props => {
    		if ("currPlayer" in $$props) $$invalidate(0, currPlayer = $$props.currPlayer);
    		if ("side" in $$props) $$invalidate(6, side = $$props.side);
    		if ("clockTime" in $$props) clockTime = $$props.clockTime;
    		if ("timer" in $$props) timer = $$props.timer;
    		if ("time" in $$props) $$invalidate(7, time = $$props.time);
    		if ("numMoves" in $$props) $$invalidate(8, numMoves = $$props.numMoves);
    		if ("rangeMoves" in $$props) $$invalidate(1, rangeMoves = $$props.rangeMoves);
    		if ("lastNumMoves" in $$props) lastNumMoves = $$props.lastNumMoves;
    		if ("currPos" in $$props) $$invalidate(2, currPos = $$props.currPos);
    		if ("nextPos" in $$props) $$invalidate(3, nextPos = $$props.nextPos);
    		if ("paused" in $$props) $$invalidate(4, paused = $$props.paused);
    		if ("timeInterval" in $$props) timeInterval = $$props.timeInterval;
    		if ("screenWidth" in $$props) $$invalidate(9, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currPlayer,
    		rangeMoves,
    		currPos,
    		nextPos,
    		paused,
    		$currUser,
    		side,
    		time,
    		numMoves,
    		screenWidth,
    		viewBoardHistory,
    		switchPlayer,
    		saveGame,
    		viewEntry,
    		timer,
    		lastNumMoves,
    		timeInterval,
    		$gameHistory,
    		$gamePref,
    		clockTime,
    		countDown,
    		startGame,
    		click_handler,
    		input_change_input_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class SinglePlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SinglePlay",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Components/gameBoard.svelte generated by Svelte v3.22.3 */

    // (9:0) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const single = new SinglePlay({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(single.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(single, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(single.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(single.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(single, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(9:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:0) {#if $gamePref != null}
    function create_if_block$3(ctx) {
    	let current;
    	const peer = new PeerPlay({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(peer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(peer, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(peer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(peer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(peer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(7:0) {#if $gamePref != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$gamePref*/ ctx[0] != null) return 0;
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

    			if (current_block_type_index !== previous_block_index) {
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $gamePref;
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(0, $gamePref = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameBoard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameBoard", $$slots, []);

    	$$self.$capture_state = () => ({
    		Peer: PeerPlay,
    		Single: SinglePlay,
    		gamePref,
    		currSocket,
    		currUser,
    		$gamePref
    	});

    	return [$gamePref];
    }

    class GameBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameBoard",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/Components/navBar.svelte generated by Svelte v3.22.3 */
    const file$8 = "src/Components/navBar.svelte";

    // (49:4) {#if $showPlayer}
    function create_if_block$4(ctx) {
    	let current;
    	const player = new AudioPlayer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(player.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(player, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(player, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(49:4) {#if $showPlayer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let t0;
    	let button0;
    	let i0;
    	let t1;
    	let span0;
    	let button0_disabled_value;
    	let t3;
    	let button1;
    	let i1;
    	let t4;
    	let span1;
    	let button1_disabled_value;
    	let t6;
    	let button2;
    	let i2;
    	let t7;
    	let span2;
    	let button2_disabled_value;
    	let t9;
    	let button3;
    	let i3;
    	let t10;
    	let span3;
    	let button3_disabled_value;
    	let t12;
    	let button4;
    	let i4;
    	let t13;
    	let span4;
    	let button4_disabled_value;
    	let div_transition;
    	let current;
    	let dispose;
    	let if_block = /*$showPlayer*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			button0 = element("button");
    			i0 = element("i");
    			t1 = space();
    			span0 = element("span");
    			span0.textContent = "Play";
    			t3 = space();
    			button1 = element("button");
    			i1 = element("i");
    			t4 = space();
    			span1 = element("span");
    			span1.textContent = "Games";
    			t6 = space();
    			button2 = element("button");
    			i2 = element("i");
    			t7 = space();
    			span2 = element("span");
    			span2.textContent = "League";
    			t9 = space();
    			button3 = element("button");
    			i3 = element("i");
    			t10 = space();
    			span3 = element("span");
    			span3.textContent = "Chat";
    			t12 = space();
    			button4 = element("button");
    			i4 = element("i");
    			t13 = space();
    			span4 = element("span");
    			span4.textContent = "Account";
    			attr_dev(i0, "class", "fa fa-play svelte-1d4szx5");
    			add_location(i0, file$8, 52, 8, 1659);
    			attr_dev(span0, "class", "label svelte-1d4szx5");
    			add_location(span0, file$8, 53, 8, 1694);
    			attr_dev(button0, "id", "play");
    			attr_dev(button0, "class", "btn btn-dark svelte-1d4szx5");
    			button0.disabled = button0_disabled_value = /*$gamePref*/ ctx[1] != null;
    			add_location(button0, file$8, 51, 4, 1539);
    			attr_dev(i1, "class", "fa fa-eye svelte-1d4szx5");
    			add_location(i1, file$8, 57, 8, 1864);
    			attr_dev(span1, "class", "label svelte-1d4szx5");
    			add_location(span1, file$8, 58, 8, 1898);
    			attr_dev(button1, "id", "eye");
    			attr_dev(button1, "class", "btn btn-dark svelte-1d4szx5");
    			button1.disabled = button1_disabled_value = /*$userGames*/ ctx[2] == null;
    			add_location(button1, file$8, 56, 4, 1745);
    			attr_dev(i2, "class", "fa fa-list-ol svelte-1d4szx5");
    			add_location(i2, file$8, 62, 8, 2073);
    			attr_dev(span2, "class", "label svelte-1d4szx5");
    			add_location(span2, file$8, 63, 8, 2111);
    			attr_dev(button2, "id", "list");
    			attr_dev(button2, "class", "btn btn-dark svelte-1d4szx5");
    			button2.disabled = button2_disabled_value = /*$leaderBoard*/ ctx[3] == null;
    			add_location(button2, file$8, 61, 4, 1950);
    			attr_dev(i3, "class", "fa fa-comments svelte-1d4szx5");
    			add_location(i3, file$8, 67, 8, 2286);
    			attr_dev(span3, "class", "label svelte-1d4szx5");
    			add_location(span3, file$8, 68, 8, 2325);
    			attr_dev(button3, "id", "comet");
    			attr_dev(button3, "class", "btn btn-dark svelte-1d4szx5");
    			button3.disabled = button3_disabled_value = /*$allChats*/ ctx[4] == null;
    			add_location(button3, file$8, 66, 4, 2164);
    			attr_dev(i4, "class", "fa fa-user svelte-1d4szx5");
    			add_location(i4, file$8, 72, 8, 2496);
    			attr_dev(span4, "class", "label svelte-1d4szx5");
    			add_location(span4, file$8, 73, 8, 2531);
    			attr_dev(button4, "id", "user");
    			attr_dev(button4, "class", "btn btn-dark svelte-1d4szx5");
    			button4.disabled = button4_disabled_value = /*$currUser*/ ctx[5] == null;
    			add_location(button4, file$8, 71, 4, 2376);
    			attr_dev(div, "class", "navbar svelte-1d4szx5");
    			add_location(div, file$8, 47, 0, 1419);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, button0);
    			append_dev(button0, i0);
    			append_dev(button0, t1);
    			append_dev(button0, span0);
    			append_dev(div, t3);
    			append_dev(div, button1);
    			append_dev(button1, i1);
    			append_dev(button1, t4);
    			append_dev(button1, span1);
    			append_dev(div, t6);
    			append_dev(div, button2);
    			append_dev(button2, i2);
    			append_dev(button2, t7);
    			append_dev(button2, span2);
    			append_dev(div, t9);
    			append_dev(div, button3);
    			append_dev(button3, i3);
    			append_dev(button3, t10);
    			append_dev(button3, span3);
    			append_dev(div, t12);
    			append_dev(div, button4);
    			append_dev(button4, i4);
    			append_dev(button4, t13);
    			append_dev(button4, span4);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[11], false, false, false),
    				listen_dev(button2, "click", /*click_handler_2*/ ctx[12], false, false, false),
    				listen_dev(button3, "click", /*click_handler_3*/ ctx[13], false, false, false),
    				listen_dev(button4, "click", /*click_handler_4*/ ctx[14], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$showPlayer*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*$showPlayer*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$gamePref*/ 2 && button0_disabled_value !== (button0_disabled_value = /*$gamePref*/ ctx[1] != null)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (!current || dirty & /*$userGames*/ 4 && button1_disabled_value !== (button1_disabled_value = /*$userGames*/ ctx[2] == null)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (!current || dirty & /*$leaderBoard*/ 8 && button2_disabled_value !== (button2_disabled_value = /*$leaderBoard*/ ctx[3] == null)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (!current || dirty & /*$allChats*/ 16 && button3_disabled_value !== (button3_disabled_value = /*$allChats*/ ctx[4] == null)) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}

    			if (!current || dirty & /*$currUser*/ 32 && button4_disabled_value !== (button4_disabled_value = /*$currUser*/ ctx[5] == null)) {
    				prop_dev(button4, "disabled", button4_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 200, duration: 1000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 200, duration: 1000 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (detaching && div_transition) div_transition.end();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $gameTab;
    	let $showPlayer;
    	let $gamePref;
    	let $userGames;
    	let $leaderBoard;
    	let $allChats;
    	let $currUser;
    	validate_store(gameTab, "gameTab");
    	component_subscribe($$self, gameTab, $$value => $$invalidate(8, $gameTab = $$value));
    	validate_store(showPlayer, "showPlayer");
    	component_subscribe($$self, showPlayer, $$value => $$invalidate(0, $showPlayer = $$value));
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(1, $gamePref = $$value));
    	validate_store(userGames, "userGames");
    	component_subscribe($$self, userGames, $$value => $$invalidate(2, $userGames = $$value));
    	validate_store(leaderBoard, "leaderBoard");
    	component_subscribe($$self, leaderBoard, $$value => $$invalidate(3, $leaderBoard = $$value));
    	validate_store(allChats, "allChats");
    	component_subscribe($$self, allChats, $$value => $$invalidate(4, $allChats = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(5, $currUser = $$value));
    	let buttonId = null;
    	let btnArr = ["play", "eye", "list", "comet", "user"];

    	setTimeout(
    		function () {
    			switch ($gameTab) {
    				case 1:
    					buttonId = btnArr[1];
    					break;
    				case 2:
    					buttonId = btnArr[2];
    					break;
    				case 3:
    					buttonId = btnArr[3];
    					break;
    				case 4:
    					buttonId = btnArr[4];
    					break;
    				default:
    					buttonId = btnArr[0];
    			}

    			let button = document.getElementById(buttonId);
    			button.setAttribute("style", "background-color:#23272b");
    		},
    		1000
    	);

    	function switchTabs(tab, id) {
    		gameTab.set(tab);
    		buttonId = id;
    		let i;

    		for (i = 0; i < btnArr.length; i++) {
    			if (btnArr[i] == id) {
    				let button = document.getElementById(btnArr[i]);
    				button.setAttribute("style", "background-color:#23272b");
    			} else {
    				let button = document.getElementById(btnArr[i]);
    				button.setAttribute("style", "background-color:#343a40");
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NavBar", $$slots, []);
    	const click_handler = () => switchTabs(0, "play");
    	const click_handler_1 = () => switchTabs(1, "eye");
    	const click_handler_2 = () => switchTabs(2, "list");
    	const click_handler_3 = () => switchTabs(3, "comet");
    	const click_handler_4 = () => switchTabs(4, "user");

    	$$self.$capture_state = () => ({
    		gameTab,
    		gamePref,
    		userGames,
    		leaderBoard,
    		allChats,
    		currUser,
    		showPlayer,
    		fly,
    		fade,
    		Player: AudioPlayer,
    		buttonId,
    		btnArr,
    		switchTabs,
    		$gameTab,
    		$showPlayer,
    		$gamePref,
    		$userGames,
    		$leaderBoard,
    		$allChats,
    		$currUser
    	});

    	$$self.$inject_state = $$props => {
    		if ("buttonId" in $$props) buttonId = $$props.buttonId;
    		if ("btnArr" in $$props) btnArr = $$props.btnArr;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		$showPlayer,
    		$gamePref,
    		$userGames,
    		$leaderBoard,
    		$allChats,
    		$currUser,
    		switchTabs,
    		buttonId,
    		$gameTab,
    		btnArr,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/Components/Notification.svelte generated by Svelte v3.22.3 */

    function create_fragment$a(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { header } = $$props;
    	let { icon } = $$props;
    	let { body } = $$props;

    	navigator.serviceWorker.ready.then(function (registration) {
    		registration.showNotification(header, {
    			body,
    			icon,
    			vibrate: [200, 100, 200, 100, 200, 100, 200]
    		});
    	});

    	const writable_props = ["header", "icon", "body"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Notification> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Notification", $$slots, []);

    	$$self.$set = $$props => {
    		if ("header" in $$props) $$invalidate(0, header = $$props.header);
    		if ("icon" in $$props) $$invalidate(1, icon = $$props.icon);
    		if ("body" in $$props) $$invalidate(2, body = $$props.body);
    	};

    	$$self.$capture_state = () => ({ header, icon, body });

    	$$self.$inject_state = $$props => {
    		if ("header" in $$props) $$invalidate(0, header = $$props.header);
    		if ("icon" in $$props) $$invalidate(1, icon = $$props.icon);
    		if ("body" in $$props) $$invalidate(2, body = $$props.body);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [header, icon, body];
    }

    class Notification$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { header: 0, icon: 1, body: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notification",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*header*/ ctx[0] === undefined && !("header" in props)) {
    			console.warn("<Notification> was created without expected prop 'header'");
    		}

    		if (/*icon*/ ctx[1] === undefined && !("icon" in props)) {
    			console.warn("<Notification> was created without expected prop 'icon'");
    		}

    		if (/*body*/ ctx[2] === undefined && !("body" in props)) {
    			console.warn("<Notification> was created without expected prop 'body'");
    		}
    	}

    	get header() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/socketRecv.svelte generated by Svelte v3.22.3 */

    const { console: console_1$3 } = globals;

    // (229:0) {#if showNotify}
    function create_if_block$5(ctx) {
    	let current;

    	const notify = new Notification$1({
    			props: {
    				header: /*header*/ ctx[1],
    				body: /*body*/ ctx[2],
    				icon: /*icon*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(notify.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notify, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const notify_changes = {};
    			if (dirty & /*header*/ 2) notify_changes.header = /*header*/ ctx[1];
    			if (dirty & /*body*/ 4) notify_changes.body = /*body*/ ctx[2];
    			if (dirty & /*icon*/ 8) notify_changes.icon = /*icon*/ ctx[3];
    			notify.$set(notify_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notify.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notify.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notify, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(229:0) {#if showNotify}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*showNotify*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showNotify*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showNotify*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $currSocket;
    	let $currUser;
    	let $allChats;
    	let $onCall;
    	let $peer;
    	let $showPlayer;
    	let $gamePref;
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(5, $currSocket = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(6, $currUser = $$value));
    	validate_store(allChats, "allChats");
    	component_subscribe($$self, allChats, $$value => $$invalidate(7, $allChats = $$value));
    	validate_store(onCall, "onCall");
    	component_subscribe($$self, onCall, $$value => $$invalidate(8, $onCall = $$value));
    	validate_store(peer, "peer");
    	component_subscribe($$self, peer, $$value => $$invalidate(9, $peer = $$value));
    	validate_store(showPlayer, "showPlayer");
    	component_subscribe($$self, showPlayer, $$value => $$invalidate(10, $showPlayer = $$value));
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(11, $gamePref = $$value));
    	let i, showNotify = false;
    	let header, body, icon;

    	let closeNotify = () => {
    		$$invalidate(0, showNotify = false);
    	};

    	$currSocket.on("online-user", data => {
    		if ($currUser != null && $currUser.isAuth && $allChats != null && $allChats.length > 0 && data != $currUser.email) {
    			for (i = 0; i < $allChats.length; i++) {
    				if (($allChats[i].priEmail == data || $allChats[i].secEmail == data) && !$allChats[i].online) {
    					allChats.update(state => {
    						state[i].online = true;
    						return state;
    					});

    					break;
    				}

    				if (($allChats[i].priEmail == data || $allChats[i].secEmail == data) && $allChats[i].online) {
    					break;
    				}
    			}

    			$currSocket.emit("go-online", $currUser.email);
    		}
    	});

    	$currSocket.on("offline-user", data => {
    		if ($currUser != null && $currUser.isAuth && $allChats != null && $allChats.length > 0 && data != $currUser.email) {
    			for (i = 0; i < $allChats.length; i++) {
    				if (($allChats[i].priEmail == data || $allChats[i].secEmail == data) && $allChats[i].online) {
    					allChats.update(state => {
    						state[i].online = false;
    						return state;
    					});

    					break;
    				}

    				if (($allChats[i].priEmail == data || $allChats[i].secEmail == data) && !$allChats[i].online) {
    					break;
    				}
    			}

    			$currSocket.emit("go-online", $currUser.email);
    		}
    	});

    	$currSocket.on("recv-msg", async data => {
    		if (data.userID == $currUser.email || data.id == $currUser.email) {
    			console.log("Received: " + data.msg.message);

    			for (i = 0; i < $allChats.length; i++) {
    				if ($allChats[i].id == data.chatID) {
    					allChats.update(state => {
    						state[i].history.push(data.msg);
    						return state;
    					});

    					break;
    				}
    			}

    			if (data.userID == $currUser.email) {
    				$$invalidate(1, header = $allChats[i].priEmail == $currUser.email
    				? $allChats[i].secName.toUpperCase()
    				: $allChats[i].priName.toUpperCase());

    				$$invalidate(2, body = data.msg.message);

    				$$invalidate(3, icon = $allChats[i].priEmail == $currUser.email
    				? "https://api.adorable.io/avatars/285/" + $allChats[i].secEmail + ".png"
    				: "https://api.adorable.io/avatars/285/" + $allChats[i].priEmail + ".png");

    				$$invalidate(0, showNotify = true);
    				setTimeout(closeNotify, 3000);
    			}

    			if ($allChats.length > 1 && i != 0) {
    				allChats.update(state => {
    					let latestChat = state[i];
    					for (let j = i; j >= 0; j--) state[j] = state[j - 1];
    					state[0] = latestChat;
    					return state;
    				});
    			}
    		}
    	});

    	$currSocket.on("recv-call", data => {
    		if (data.calleeID == $currUser.email && !$onCall) {
    			console.log("receving call from " + data.callerName);
    			callerName.set(data.callerName);
    			callerID.set(data.callerID);
    			callerSignal.set(data.signal);

    			if (!$onCall) {
    				showCallBar.set(true);
    				showCaller.set(true);
    				setInterval(blink_text, 1000);

    				setTimeout(
    					function () {
    						window.$("#stream").draggable();
    					},
    					1000
    				);
    			}
    		}
    	});

    	$currSocket.on("call-accepted", data => {
    		if (data.callerID == $currUser.email && !$onCall) {
    			console.log("Call Accepted");
    			showCallee.set(false);
    			showCallBar.set(false);
    			$peer.signal(data.signal);
    		}
    	});

    	$currSocket.on("end-call", data => {
    		if (data.callerID == $currUser.email || data.calleeID == $currUser.email) {
    			console.log("Ending call");

    			if ($onCall) {
    				let audio = document.getElementById("audio");
    				audio.src = "";
    				$peer.destroy();
    				onCall.set(false);
    				if ($showPlayer) showPlayer.set(false);
    			}

    			showCallBar.set(false);
    		}
    	});

    	$currSocket.on("get-second-user", data => {
    		if (data.gameID == $gamePref.gameID && $gamePref.oppID == null && $gamePref.opp == null && $gamePref.currPlayer != null) {
    			console.log("Received second player");

    			gamePref.update(state => {
    				state.opp = data.name;
    				state.oppID = data.email;
    				return state;
    			});

    			getAllChats();

    			$currSocket.emit("send-first-user", {
    				gameID: $gamePref.gameID,
    				name: $currUser.name
    			});

    			viewCreateGame.set(false);
    			smallPopUp.set(false);
    			gameTab.set(5);
    		}
    	});

    	$currSocket.on("get-first-user", data => {
    		if (data.gameID == $gamePref.gameID && $gamePref.opp == null && $gamePref.currPlayer != null) {
    			console.log("Received first player");

    			gamePref.update(state => {
    				state.opp = data.name;
    				return state;
    			});

    			getAllChats();
    			gameTab.set(5);
    		}
    	});

    	$currSocket.on("start-game", gameID => {
    		if ($gamePref != null && gameID == $gamePref.gameID) {
    			console.log("Game Started");

    			gamePref.update(state => {
    				state.paused = false;
    				return state;
    			});

    			$$invalidate(1, header = $gamePref.gameID + " Game");
    			$$invalidate(2, body = "Game with " + $gamePref.opp + " has started");
    			$$invalidate(3, icon = "images/LOGO-192.png");
    			$$invalidate(0, showNotify = true);
    			setTimeout(closeNotify, 3000);
    		}
    	});

    	$currSocket.on("game-save", data => {
    		if (data.gameID == $gamePref.gameID) {
    			if (data.oppID == $currUser.email) {
    				$$invalidate(1, header = $gamePref.gameID + " Game");
    				$$invalidate(2, body = $gamePref.opp + " is Saving Game");
    				$$invalidate(3, icon = "images/LOGO-192.png");
    				$$invalidate(0, showNotify = true);
    				setTimeout(closeNotify, 3000);
    			}

    			console.log("Game Saved");

    			let request = {
    				func: "saveGame",
    				id: $currUser.email,
    				gameID: $gamePref.gameID,
    				initiator: $gamePref.initiator,
    				gameHistory: $gamePref.states,
    				numMoves: $gamePref.numMoves,
    				myMoves: $gamePref.myMoves,
    				minutes: Math.ceil($gamePref.secondsPlayed / 60),
    				currPlayer: $gamePref.currPlayer
    			};

    			$currSocket.emit("save-game", request);
    			if (!data.auto) gamePref.set(null);
    		}
    	});

    	$currSocket.on("refresh-list", () => {
    		console.log("Refreshing Game list");
    		getUserGames();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<SocketRecv> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SocketRecv", $$slots, []);

    	$$self.$capture_state = () => ({
    		gamePref,
    		gameBoard,
    		currSocket,
    		gameHistory,
    		peer,
    		showCallee,
    		showCallBar,
    		callerSignal,
    		onCall,
    		gameTab,
    		page,
    		currUser,
    		allChats,
    		viewCreateGame,
    		smallPopUp,
    		callerName,
    		callerID,
    		showCaller,
    		showPlayer,
    		getAllChats,
    		blink_text,
    		getUserGames,
    		Notify: Notification$1,
    		i,
    		showNotify,
    		header,
    		body,
    		icon,
    		closeNotify,
    		$currSocket,
    		$currUser,
    		$allChats,
    		$onCall,
    		$peer,
    		$showPlayer,
    		$gamePref
    	});

    	$$self.$inject_state = $$props => {
    		if ("i" in $$props) i = $$props.i;
    		if ("showNotify" in $$props) $$invalidate(0, showNotify = $$props.showNotify);
    		if ("header" in $$props) $$invalidate(1, header = $$props.header);
    		if ("body" in $$props) $$invalidate(2, body = $$props.body);
    		if ("icon" in $$props) $$invalidate(3, icon = $$props.icon);
    		if ("closeNotify" in $$props) closeNotify = $$props.closeNotify;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showNotify, header, body, icon];
    }

    class SocketRecv extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SocketRecv",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    class Game {

        constructor(game, initState, initiator) {

            this.gameID = game._id;
            this.initiator = initiator;
            this.time = game.time;
            this.timer = game.time;
            this.opp = null;
            this.oppID = initiator == false ? game.priEmail : null;
            this.currPlayer = game.currPlayer;
            this.numMoves = game.priMoves + game.secMoves;
            this.myMoves = game.priEmail == game.email ? game.priMoves : game.secMoves;
            this.rangeMoves = game.priMoves + game.secMoves;
            this.paused = game.finished == true ? false : true;
            this.finished = game.finished;
            this.side = game.side;
            this.secondsPlayed = game.minutesPlayed * 60;
            this.states = initState.length == 8 ? [initState] : initState;
        }
    }

    /* src/Components/gameCreate.svelte generated by Svelte v3.22.3 */

    const { console: console_1$4 } = globals;
    const file$9 = "src/Components/gameCreate.svelte";

    // (107:0) {:else}
    function create_else_block_1$2(ctx) {
    	let h5;
    	let t0;
    	let t1_value = /*$gamePref*/ ctx[2].gameID + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			t0 = text("Please share Game Password '");
    			t1 = text(t1_value);
    			t2 = text("' with other player");
    			set_style(h5, "text-align", "center");
    			set_style(h5, "margin-top", "50%");
    			attr_dev(h5, "class", "svelte-47gp1b");
    			add_location(h5, file$9, 107, 4, 3397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t0);
    			append_dev(h5, t1);
    			append_dev(h5, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gamePref*/ 4 && t1_value !== (t1_value = /*$gamePref*/ ctx[2].gameID + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(107:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (69:0) {#if $gamePref == null}
    function create_if_block$6(ctx) {
    	let t0;
    	let h5;
    	let t2;
    	let div4;
    	let h60;
    	let t4;
    	let div0;
    	let input0;
    	let t5;
    	let label0;
    	let t7;
    	let div1;
    	let input1;
    	let t8;
    	let label1;
    	let t10;
    	let div2;
    	let input2;
    	let t11;
    	let label2;
    	let t13;
    	let div3;
    	let input3;
    	let t14;
    	let label3;
    	let t16;
    	let h61;
    	let t17;
    	let t18;
    	let t19;
    	let input4;
    	let t20;
    	let current_block_type_index;
    	let if_block1;
    	let if_block1_anchor;
    	let current;
    	let dispose;
    	let if_block0 = /*$ratio*/ ctx[3] < 1 && create_if_block_2$3(ctx);
    	const if_block_creators = [create_if_block_1$3, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			h5 = element("h5");
    			h5.textContent = "Game Preferences";
    			t2 = space();
    			div4 = element("div");
    			h60 = element("h6");
    			h60.textContent = "Time Per Turn (seconds)";
    			t4 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t5 = space();
    			label0 = element("label");
    			label0.textContent = "15";
    			t7 = space();
    			div1 = element("div");
    			input1 = element("input");
    			t8 = space();
    			label1 = element("label");
    			label1.textContent = "30";
    			t10 = space();
    			div2 = element("div");
    			input2 = element("input");
    			t11 = space();
    			label2 = element("label");
    			label2.textContent = "45";
    			t13 = space();
    			div3 = element("div");
    			input3 = element("input");
    			t14 = space();
    			label3 = element("label");
    			label3.textContent = "60";
    			t16 = space();
    			h61 = element("h6");
    			t17 = text(/*Time*/ ctx[0]);
    			t18 = text(" seconds");
    			t19 = space();
    			input4 = element("input");
    			t20 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(h5, "class", "svelte-47gp1b");
    			add_location(h5, file$9, 72, 4, 1910);
    			attr_dev(h60, "class", "svelte-47gp1b");
    			add_location(h60, file$9, 75, 8, 1968);
    			attr_dev(input0, "class", "form-check-input");
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "inlineRadioOptions");
    			attr_dev(input0, "id", "inlineRadio1");
    			add_location(input0, file$9, 78, 12, 2065);
    			attr_dev(label0, "class", "form-check-label");
    			attr_dev(label0, "for", "inlineRadio1");
    			add_location(label0, file$9, 79, 12, 2202);
    			attr_dev(div0, "class", "form-check form-check-inline svelte-47gp1b");
    			add_location(div0, file$9, 77, 8, 2010);
    			attr_dev(input1, "class", "form-check-input");
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "inlineRadioOptions");
    			attr_dev(input1, "id", "inlineRadio2");
    			add_location(input1, file$9, 83, 12, 2343);
    			attr_dev(label1, "class", "form-check-label");
    			attr_dev(label1, "for", "inlineRadio2");
    			add_location(label1, file$9, 84, 12, 2480);
    			attr_dev(div1, "class", "form-check form-check-inline svelte-47gp1b");
    			add_location(div1, file$9, 82, 8, 2288);
    			attr_dev(input2, "class", "form-check-input");
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "inlineRadioOptions");
    			attr_dev(input2, "id", "inlineRadio3");
    			add_location(input2, file$9, 88, 12, 2621);
    			attr_dev(label2, "class", "form-check-label");
    			attr_dev(label2, "for", "inlineRadio3");
    			add_location(label2, file$9, 89, 12, 2758);
    			attr_dev(div2, "class", "form-check form-check-inline svelte-47gp1b");
    			add_location(div2, file$9, 87, 8, 2566);
    			attr_dev(input3, "class", "form-check-input");
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "inlineRadioOptions");
    			attr_dev(input3, "id", "inlineRadio3");
    			add_location(input3, file$9, 93, 12, 2899);
    			attr_dev(label3, "class", "form-check-label");
    			attr_dev(label3, "for", "inlineRadio3");
    			add_location(label3, file$9, 94, 12, 3036);
    			attr_dev(div3, "class", "form-check form-check-inline svelte-47gp1b");
    			add_location(div3, file$9, 92, 8, 2844);
    			attr_dev(div4, "id", "suggest");
    			attr_dev(div4, "class", "svelte-47gp1b");
    			add_location(div4, file$9, 74, 4, 1941);
    			attr_dev(h61, "class", "svelte-47gp1b");
    			add_location(h61, file$9, 98, 4, 3129);
    			attr_dev(input4, "class", "custom-range svelte-47gp1b");
    			attr_dev(input4, "type", "range");
    			attr_dev(input4, "min", "15");
    			attr_dev(input4, "max", "60");
    			attr_dev(input4, "step", "1");
    			add_location(input4, file$9, 99, 4, 3157);
    		},
    		m: function mount(target, anchor, remount) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h60);
    			append_dev(div4, t4);
    			append_dev(div4, div0);
    			append_dev(div0, input0);
    			append_dev(div0, t5);
    			append_dev(div0, label0);
    			append_dev(div4, t7);
    			append_dev(div4, div1);
    			append_dev(div1, input1);
    			append_dev(div1, t8);
    			append_dev(div1, label1);
    			append_dev(div4, t10);
    			append_dev(div4, div2);
    			append_dev(div2, input2);
    			append_dev(div2, t11);
    			append_dev(div2, label2);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, input3);
    			append_dev(div3, t14);
    			append_dev(div3, label3);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, h61, anchor);
    			append_dev(h61, t17);
    			append_dev(h61, t18);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, input4, anchor);
    			set_input_value(input4, /*Time*/ ctx[0]);
    			insert_dev(target, t20, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "change", /*change_handler*/ ctx[9], false, false, false),
    				listen_dev(input1, "change", /*change_handler_1*/ ctx[10], false, false, false),
    				listen_dev(input2, "change", /*change_handler_2*/ ctx[11], false, false, false),
    				listen_dev(input3, "change", /*change_handler_3*/ ctx[12], false, false, false),
    				listen_dev(input4, "change", /*input4_change_input_handler*/ ctx[13]),
    				listen_dev(input4, "input", /*input4_change_input_handler*/ ctx[13])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (/*$ratio*/ ctx[3] < 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty & /*Time*/ 1) set_data_dev(t17, /*Time*/ ctx[0]);

    			if (dirty & /*Time*/ 1) {
    				set_input_value(input4, /*Time*/ ctx[0]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(h61);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(input4);
    			if (detaching) detach_dev(t20);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(69:0) {#if $gamePref == null}",
    		ctx
    	});

    	return block;
    }

    // (70:4) {#if $ratio < 1}
    function create_if_block_2$3(ctx) {
    	let button;
    	let i;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			t = text("  Back");
    			attr_dev(i, "class", "fa fa-arrow-left");
    			add_location(i, file$9, 70, 70, 1848);
    			attr_dev(button, "id", "backBtn");
    			attr_dev(button, "class", "btn btn-dark svelte-47gp1b");
    			add_location(button, file$9, 70, 8, 1786);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);
    			append_dev(button, t);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", goBack, false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(70:4) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (104:4) {:else}
    function create_else_block$4(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Create";
    			attr_dev(button, "class", "btn btn-primary svelte-47gp1b");
    			add_location(button, file$9, 104, 8, 3303);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*createGame*/ ctx[5], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(104:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (102:4) {#if loading}
    function create_if_block_1$3(ctx) {
    	let current;
    	const loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(102:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block_1$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$gamePref*/ ctx[2] == null) return 0;
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function goBack() {
    	let index = document.getElementById("index");
    	index.setAttribute("style", "left:0");
    	let create = document.getElementById("create");
    	create.setAttribute("style", "left:100%;");
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $currUser;
    	let $gameBoard;
    	let $gamePref;
    	let $ratio;
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(7, $currUser = $$value));
    	validate_store(gameBoard, "gameBoard");
    	component_subscribe($$self, gameBoard, $$value => $$invalidate(8, $gameBoard = $$value));
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(2, $gamePref = $$value));
    	validate_store(ratio, "ratio");
    	component_subscribe($$self, ratio, $$value => $$invalidate(3, $ratio = $$value));
    	let Time = 15;
    	let request;
    	let loading = false;

    	function selectTime(time) {
    		$$invalidate(0, Time = time);
    	}

    	function createGame() {
    		$$invalidate(1, loading = true);

    		request = {
    			func: "createGame",
    			email: $currUser.email,
    			name: $currUser.name,
    			time: Time,
    			date: moment().format("YYYY-MM-DD")
    		};

    		invokeFunction(request).then(response => {
    			console.log(response);

    			if (response.msg != null) {
    				console.log(response.msg);
    				let game = response.msg;
    				game.time = Time;
    				game.side = 0;
    				game.name = $currUser.name;
    				game.email = $currUser.email;
    				gameBoard.set(new Board(null, false));
    				gamePref.set(new Game(game, $gameBoard.saveBoardState(), true));
    				$$invalidate(1, loading = false);
    			} else {
    				$$invalidate(1, loading = false);
    				console.log(response.err);
    			}
    		}).catch(error => {
    			$$invalidate(1, loading = false);
    			console.log(error);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<GameCreate> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameCreate", $$slots, []);
    	const change_handler = () => selectTime(15);
    	const change_handler_1 = () => selectTime(30);
    	const change_handler_2 = () => selectTime(45);
    	const change_handler_3 = () => selectTime(60);

    	function input4_change_input_handler() {
    		Time = to_number(this.value);
    		$$invalidate(0, Time);
    	}

    	$$self.$capture_state = () => ({
    		currUser,
    		gameBoard,
    		gameHistory,
    		gamePref,
    		page,
    		gameTab,
    		viewCreateGame,
    		smallPopUp,
    		ratio,
    		invokeFunction,
    		Board,
    		Game,
    		Loader,
    		Time,
    		request,
    		loading,
    		selectTime,
    		createGame,
    		goBack,
    		$currUser,
    		$gameBoard,
    		$gamePref,
    		$ratio
    	});

    	$$self.$inject_state = $$props => {
    		if ("Time" in $$props) $$invalidate(0, Time = $$props.Time);
    		if ("request" in $$props) request = $$props.request;
    		if ("loading" in $$props) $$invalidate(1, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		Time,
    		loading,
    		$gamePref,
    		$ratio,
    		selectTime,
    		createGame,
    		request,
    		$currUser,
    		$gameBoard,
    		change_handler,
    		change_handler_1,
    		change_handler_2,
    		change_handler_3,
    		input4_change_input_handler
    	];
    }

    class GameCreate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameCreate",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/Components/gameJoin.svelte generated by Svelte v3.22.3 */

    const { console: console_1$5 } = globals;
    const file$a = "src/Components/gameJoin.svelte";

    // (92:0) {#if $ratio < 1}
    function create_if_block_2$4(ctx) {
    	let button;
    	let t;
    	let i;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Back ");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-arrow-right");
    			add_location(i, file$a, 92, 71, 2909);
    			attr_dev(button, "id", "backBtn");
    			attr_dev(button, "class", "btn btn-dark svelte-dyewdt");
    			add_location(button, file$a, 92, 4, 2842);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			append_dev(button, i);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", goBack$1, false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(92:0) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (98:0) {#if viewError}
    function create_if_block_1$4(ctx) {
    	let h6;
    	let t;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			t = text(/*errMsg*/ ctx[2]);
    			set_style(h6, "text-align", "center");
    			set_style(h6, "color", "red");
    			set_style(h6, "margin-top", "20px");
    			add_location(h6, file$a, 98, 4, 3009);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errMsg*/ 4) set_data_dev(t, /*errMsg*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(98:0) {#if viewError}",
    		ctx
    	});

    	return block;
    }

    // (106:0) {:else}
    function create_else_block$5(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Join";
    			attr_dev(button, "class", "btn btn-primary svelte-dyewdt");
    			set_style(button, "margin-bottom", "30px");
    			add_location(button, file$a, 106, 4, 3267);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*joinGame*/ ctx[5], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(106:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (104:0) {#if loading}
    function create_if_block$7(ctx) {
    	let current;
    	const loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(104:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let t0;
    	let h5;
    	let t2;
    	let t3;
    	let input;
    	let t4;
    	let current_block_type_index;
    	let if_block2;
    	let if_block2_anchor;
    	let current;
    	let dispose;
    	let if_block0 = /*$ratio*/ ctx[4] < 1 && create_if_block_2$4(ctx);
    	let if_block1 = /*viewError*/ ctx[1] && create_if_block_1$4(ctx);
    	const if_block_creators = [create_if_block$7, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			h5 = element("h5");
    			h5.textContent = "Game Password";
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(h5, "class", "svelte-dyewdt");
    			add_location(h5, file$a, 95, 0, 2962);
    			attr_dev(input, "placeholder", "Game Password");
    			input.required = true;
    			attr_dev(input, "class", "svelte-dyewdt");
    			add_location(input, file$a, 101, 0, 3090);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*gamePassword*/ ctx[0]);
    			insert_dev(target, t4, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[10]),
    				listen_dev(input, "keydown", /*keydown_handler*/ ctx[11], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$ratio*/ ctx[4] < 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*viewError*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
    					if_block1.c();
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*gamePassword*/ 1 && input.value !== /*gamePassword*/ ctx[0]) {
    				set_input_value(input, /*gamePassword*/ ctx[0]);
    			}

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
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t4);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function goBack$1() {
    	let index = document.getElementById("index");
    	index.setAttribute("style", "left:0");
    	let join = document.getElementById("join");
    	join.setAttribute("style", "left:-100%;");
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $currUser;
    	let $gameBoard;
    	let $ratio;
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(7, $currUser = $$value));
    	validate_store(gameBoard, "gameBoard");
    	component_subscribe($$self, gameBoard, $$value => $$invalidate(8, $gameBoard = $$value));
    	validate_store(ratio, "ratio");
    	component_subscribe($$self, ratio, $$value => $$invalidate(4, $ratio = $$value));
    	let gamePassword;
    	let request;
    	let viewError = false, errMsg;
    	let loading = false;

    	function joinGame() {
    		if (gamePassword != null) {
    			$$invalidate(3, loading = true);

    			request = {
    				func: "joinGame",
    				gameID: gamePassword,
    				email: $currUser.email,
    				name: $currUser.name
    			};

    			invokeFunction(request).then(response => {
    				console.log(response);

    				if (response.msg != null) {
    					let game = response.msg;

    					if (game.priEmail != $currUser.email) {
    						game.name = $currUser.name;
    						game.email = $currUser.email;
    						game.side = 1;
    						gameBoard.set(new Board(null, true));
    						gamePref.set(new Game(game, $gameBoard.saveBoardState(), false));
    						$$invalidate(3, loading = false);
    						smallPopUp.set(false);
    						viewJoinGame.set(false);
    						gameTab.set(2);
    					} else {
    						$$invalidate(3, loading = false);
    						$$invalidate(2, errMsg = "Cannot Join A Game You Created");
    						$$invalidate(1, viewError = true);
    						deleteGame(gamePassword);
    					}
    				} else {
    					$$invalidate(3, loading = false);
    					console.log(response.err);
    				}
    			}).catch(error => {
    				$$invalidate(3, loading = false);
    				console.log(error);
    			});
    		}
    	}

    	function deleteGame(gameID) {
    		request = { func: "deleteGame", gameID };

    		invokeFunction(request).then(response => {
    			console.log(response);

    			if (response.msg == "SUCCESS") {
    				console.log("Game deleted successfully");
    			} else {
    				console.log(response.err);
    			}
    		}).catch(error => {
    			console.log(error);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<GameJoin> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameJoin", $$slots, []);

    	function input_input_handler() {
    		gamePassword = this.value;
    		$$invalidate(0, gamePassword);
    	}

    	const keydown_handler = event => event.which === 13 && joinGame();

    	$$self.$capture_state = () => ({
    		invokeFunction,
    		currSocket,
    		currUser,
    		gameBoard,
    		gameHistory,
    		gamePref,
    		page,
    		gameTab,
    		viewJoinGame,
    		smallPopUp,
    		ratio,
    		Board,
    		Loader,
    		Game,
    		getAllChats,
    		gamePassword,
    		request,
    		viewError,
    		errMsg,
    		loading,
    		joinGame,
    		deleteGame,
    		goBack: goBack$1,
    		$currUser,
    		$gameBoard,
    		$ratio
    	});

    	$$self.$inject_state = $$props => {
    		if ("gamePassword" in $$props) $$invalidate(0, gamePassword = $$props.gamePassword);
    		if ("request" in $$props) request = $$props.request;
    		if ("viewError" in $$props) $$invalidate(1, viewError = $$props.viewError);
    		if ("errMsg" in $$props) $$invalidate(2, errMsg = $$props.errMsg);
    		if ("loading" in $$props) $$invalidate(3, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		gamePassword,
    		viewError,
    		errMsg,
    		loading,
    		$ratio,
    		joinGame,
    		request,
    		$currUser,
    		$gameBoard,
    		deleteGame,
    		input_input_handler,
    		keydown_handler
    	];
    }

    class GameJoin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameJoin",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/Components/gameList.svelte generated by Svelte v3.22.3 */
    const file$b = "src/Components/gameList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (56:0) {:else}
    function create_else_block$6(ctx) {
    	let div0;
    	let h50;
    	let t1;
    	let t2;
    	let h51;
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let t7;
    	let h40;
    	let t8;
    	let span0;
    	let t9_value = /*currGame*/ ctx[0].date + "";
    	let t9;
    	let t10;
    	let h41;
    	let t11;
    	let span1;

    	let t12_value = (/*currGame*/ ctx[0].finished == true
    	? "Finished"
    	: "On-Going") + "";

    	let t12;
    	let t13;
    	let h42;
    	let t14;
    	let span2;
    	let t15_value = /*currGame*/ ctx[0].time + "";
    	let t15;
    	let t16;
    	let t17;
    	let h43;
    	let t18;
    	let span3;

    	let t19_value = (/*currGame*/ ctx[0].finished == true
    	? /*currGame*/ ctx[0].gameHistory.length - 1
    	: /*currGame*/ ctx[0].numMoves) + "";

    	let t19;
    	let t20;
    	let h44;
    	let t21;
    	let span4;

    	let t22_value = (/*currGame*/ ctx[0].priPlayer == /*$currUser*/ ctx[2].name
    	? /*currGame*/ ctx[0].priMoves
    	: /*currGame*/ ctx[0].secMoves) + "";

    	let t22;
    	let t23;
    	let h45;
    	let t24;
    	let span5;
    	let t25_value = /*currGame*/ ctx[0].minutesPlayed + "";
    	let t25;
    	let t26;
    	let t27;
    	let h46;
    	let t28;
    	let span6;

    	let t29_value = (/*currGame*/ ctx[0].currPlayer == "red" && /*currGame*/ ctx[0].priEmail == /*$currUser*/ ctx[2].email
    	? "You"
    	: /*currGame*/ ctx[0].secPlayer.toUpperCase()) + "";

    	let t29;
    	let t30;
    	let button;

    	let t31_value = (/*currGame*/ ctx[0].finished == true
    	? "Review Game"
    	: "Resume Game") + "";

    	let t31;
    	let button_class_value;
    	let dispose;
    	let each_value_1 = /*$userGames*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*$userGames*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let if_block0 = /*$ratio*/ ctx[3] < 1 && create_if_block_2$5(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*currGame*/ ctx[0].secPlayer != null) return create_if_block_1$5;
    		return create_else_block_1$3;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h50 = element("h5");
    			h50.textContent = "On-Going Games";
    			t1 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			h51 = element("h5");
    			h51.textContent = "Finished Games";
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if_block1.c();
    			t7 = space();
    			h40 = element("h4");
    			t8 = text("Date Started: ");
    			span0 = element("span");
    			t9 = text(t9_value);
    			t10 = space();
    			h41 = element("h4");
    			t11 = text("Status: ");
    			span1 = element("span");
    			t12 = text(t12_value);
    			t13 = space();
    			h42 = element("h4");
    			t14 = text("Turn Time: ");
    			span2 = element("span");
    			t15 = text(t15_value);
    			t16 = text(" seconds");
    			t17 = space();
    			h43 = element("h4");
    			t18 = text("Total Moves: ");
    			span3 = element("span");
    			t19 = text(t19_value);
    			t20 = space();
    			h44 = element("h4");
    			t21 = text("My Moves: ");
    			span4 = element("span");
    			t22 = text(t22_value);
    			t23 = space();
    			h45 = element("h4");
    			t24 = text("Minutes Played: ");
    			span5 = element("span");
    			t25 = text(t25_value);
    			t26 = text(" minutes");
    			t27 = space();
    			h46 = element("h4");
    			t28 = text("Current Player: ");
    			span6 = element("span");
    			t29 = text(t29_value);
    			t30 = space();
    			button = element("button");
    			t31 = text(t31_value);
    			attr_dev(h50, "class", "svelte-nf23x8");
    			add_location(h50, file$b, 57, 9, 1929);
    			attr_dev(h51, "class", "svelte-nf23x8");
    			add_location(h51, file$b, 68, 8, 2645);
    			attr_dev(div0, "id", "gameList");
    			attr_dev(div0, "class", "container-fluid svelte-nf23x8");
    			add_location(div0, file$b, 56, 4, 1876);
    			attr_dev(span0, "class", "svelte-nf23x8");
    			add_location(span0, file$b, 84, 41, 3713);
    			attr_dev(h40, "class", "detail svelte-nf23x8");
    			add_location(h40, file$b, 84, 8, 3680);
    			attr_dev(span1, "class", "svelte-nf23x8");
    			add_location(span1, file$b, 85, 35, 3782);
    			attr_dev(h41, "class", "detail svelte-nf23x8");
    			add_location(h41, file$b, 85, 8, 3755);
    			attr_dev(span2, "class", "svelte-nf23x8");
    			add_location(span2, file$b, 86, 38, 3892);
    			attr_dev(h42, "class", "detail svelte-nf23x8");
    			add_location(h42, file$b, 86, 8, 3862);
    			attr_dev(span3, "class", "svelte-nf23x8");
    			add_location(span3, file$b, 87, 40, 3974);
    			attr_dev(h43, "class", "detail svelte-nf23x8");
    			add_location(h43, file$b, 87, 8, 3942);
    			attr_dev(span4, "class", "svelte-nf23x8");
    			add_location(span4, file$b, 88, 37, 4111);
    			attr_dev(h44, "class", "detail svelte-nf23x8");
    			add_location(h44, file$b, 88, 8, 4082);
    			attr_dev(span5, "class", "svelte-nf23x8");
    			add_location(span5, file$b, 89, 43, 4251);
    			attr_dev(h45, "class", "detail svelte-nf23x8");
    			add_location(h45, file$b, 89, 8, 4216);
    			attr_dev(span6, "class", "svelte-nf23x8");
    			add_location(span6, file$b, 90, 43, 4345);
    			attr_dev(h46, "class", "detail svelte-nf23x8");
    			add_location(h46, file$b, 90, 8, 4310);
    			attr_dev(button, "id", "getGame");

    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*currGame*/ ctx[0].finished == true
    			? "btn btn-primary"
    			: "btn- btn-warning") + " svelte-nf23x8"));

    			add_location(button, file$b, 92, 8, 4487);
    			attr_dev(div1, "id", "gameDetails");
    			attr_dev(div1, "class", "svelte-nf23x8");
    			add_location(div1, file$b, 75, 4, 3030);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h50);
    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div0, t2);
    			append_dev(div0, h51);
    			append_dev(div0, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t6);
    			if_block1.m(div1, null);
    			append_dev(div1, t7);
    			append_dev(div1, h40);
    			append_dev(h40, t8);
    			append_dev(h40, span0);
    			append_dev(span0, t9);
    			append_dev(div1, t10);
    			append_dev(div1, h41);
    			append_dev(h41, t11);
    			append_dev(h41, span1);
    			append_dev(span1, t12);
    			append_dev(div1, t13);
    			append_dev(div1, h42);
    			append_dev(h42, t14);
    			append_dev(h42, span2);
    			append_dev(span2, t15);
    			append_dev(span2, t16);
    			append_dev(div1, t17);
    			append_dev(div1, h43);
    			append_dev(h43, t18);
    			append_dev(h43, span3);
    			append_dev(span3, t19);
    			append_dev(div1, t20);
    			append_dev(div1, h44);
    			append_dev(h44, t21);
    			append_dev(h44, span4);
    			append_dev(span4, t22);
    			append_dev(div1, t23);
    			append_dev(div1, h45);
    			append_dev(h45, t24);
    			append_dev(h45, span5);
    			append_dev(span5, t25);
    			append_dev(span5, t26);
    			append_dev(div1, t27);
    			append_dev(div1, h46);
    			append_dev(h46, t28);
    			append_dev(h46, span6);
    			append_dev(span6, t29);
    			append_dev(div1, t30);
    			append_dev(div1, button);
    			append_dev(button, t31);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*getGame*/ ctx[5], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*viewGameDetails, $userGames, $currUser, currGame*/ 23) {
    				each_value_1 = /*$userGames*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, t2);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*viewGameDetails, $userGames, $currUser*/ 22) {
    				each_value = /*$userGames*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*$ratio*/ ctx[3] < 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$5(ctx);
    					if_block0.c();
    					if_block0.m(div1, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, t7);
    				}
    			}

    			if (dirty & /*currGame*/ 1 && t9_value !== (t9_value = /*currGame*/ ctx[0].date + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*currGame*/ 1 && t12_value !== (t12_value = (/*currGame*/ ctx[0].finished == true
    			? "Finished"
    			: "On-Going") + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*currGame*/ 1 && t15_value !== (t15_value = /*currGame*/ ctx[0].time + "")) set_data_dev(t15, t15_value);

    			if (dirty & /*currGame*/ 1 && t19_value !== (t19_value = (/*currGame*/ ctx[0].finished == true
    			? /*currGame*/ ctx[0].gameHistory.length - 1
    			: /*currGame*/ ctx[0].numMoves) + "")) set_data_dev(t19, t19_value);

    			if (dirty & /*currGame, $currUser*/ 5 && t22_value !== (t22_value = (/*currGame*/ ctx[0].priPlayer == /*$currUser*/ ctx[2].name
    			? /*currGame*/ ctx[0].priMoves
    			: /*currGame*/ ctx[0].secMoves) + "")) set_data_dev(t22, t22_value);

    			if (dirty & /*currGame*/ 1 && t25_value !== (t25_value = /*currGame*/ ctx[0].minutesPlayed + "")) set_data_dev(t25, t25_value);

    			if (dirty & /*currGame, $currUser*/ 5 && t29_value !== (t29_value = (/*currGame*/ ctx[0].currPlayer == "red" && /*currGame*/ ctx[0].priEmail == /*$currUser*/ ctx[2].email
    			? "You"
    			: /*currGame*/ ctx[0].secPlayer.toUpperCase()) + "")) set_data_dev(t29, t29_value);

    			if (dirty & /*currGame*/ 1 && t31_value !== (t31_value = (/*currGame*/ ctx[0].finished == true
    			? "Review Game"
    			: "Resume Game") + "")) set_data_dev(t31, t31_value);

    			if (dirty & /*currGame*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*currGame*/ ctx[0].finished == true
    			? "btn btn-primary"
    			: "btn- btn-warning") + " svelte-nf23x8"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(56:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:0) {#if $userGames.length == 0}
    function create_if_block$8(ctx) {
    	let h50;
    	let t1;
    	let h51;

    	const block = {
    		c: function create() {
    			h50 = element("h5");
    			h50.textContent = "There are no games to view";
    			t1 = space();
    			h51 = element("h5");
    			h51.textContent = "Create or Join a Game";
    			attr_dev(h50, "class", "empty svelte-nf23x8");
    			set_style(h50, "margin-top", "25%");
    			add_location(h50, file$b, 53, 4, 1741);
    			attr_dev(h51, "class", "empty svelte-nf23x8");
    			add_location(h51, file$b, 54, 4, 1819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h50, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h51, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h50);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h51);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(53:0) {#if $userGames.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (60:12) {#if !game.finished}
    function create_if_block_4$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*game*/ ctx[9].secPlayer != null) return create_if_block_5$1;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
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
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(60:12) {#if !game.finished}",
    		ctx
    	});

    	return block;
    }

    // (63:16) {:else}
    function create_else_block_2$1(ctx) {
    	let button;

    	let t0_value = (/*game*/ ctx[9].priPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: /*game*/ ctx[9].priPlayer.toUpperCase()) + "";

    	let t0;
    	let t1;

    	let t2_value = (/*game*/ ctx[9].secPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: "Unknown Player") + "";

    	let t2;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[7](/*game*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" vs. ");
    			t2 = text(t2_value);
    			attr_dev(button, "class", "btn btn-dark svelte-nf23x8");
    			add_location(button, file$b, 63, 20, 2363);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$userGames, $currUser*/ 6 && t0_value !== (t0_value = (/*game*/ ctx[9].priPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: /*game*/ ctx[9].priPlayer.toUpperCase()) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$userGames, $currUser*/ 6 && t2_value !== (t2_value = (/*game*/ ctx[9].secPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: "Unknown Player") + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(63:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (61:16) {#if game.secPlayer != null}
    function create_if_block_5$1(ctx) {
    	let button;

    	let t0_value = (/*game*/ ctx[9].priPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: /*game*/ ctx[9].priPlayer.toUpperCase()) + "";

    	let t0;
    	let t1;

    	let t2_value = (/*game*/ ctx[9].secPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: /*currGame*/ ctx[0].secPlayer.toUpperCase()) + "";

    	let t2;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*game*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" vs. ");
    			t2 = text(t2_value);
    			attr_dev(button, "class", "btn btn-dark svelte-nf23x8");
    			add_location(button, file$b, 61, 20, 2086);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$userGames, $currUser*/ 6 && t0_value !== (t0_value = (/*game*/ ctx[9].priPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: /*game*/ ctx[9].priPlayer.toUpperCase()) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$userGames, $currUser, currGame*/ 7 && t2_value !== (t2_value = (/*game*/ ctx[9].secPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: /*currGame*/ ctx[0].secPlayer.toUpperCase()) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(61:16) {#if game.secPlayer != null}",
    		ctx
    	});

    	return block;
    }

    // (59:8) {#each $userGames as game}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;
    	let if_block = !/*game*/ ctx[9].finished && create_if_block_4$1(ctx);

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
    			if (!/*game*/ ctx[9].finished) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(59:8) {#each $userGames as game}",
    		ctx
    	});

    	return block;
    }

    // (71:12) {#if game.finished}
    function create_if_block_3$1(ctx) {
    	let button;

    	let t0_value = (/*game*/ ctx[9].priPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: /*game*/ ctx[9].priPlayer.toUpperCase()) + "";

    	let t0;
    	let t1;

    	let t2_value = (/*game*/ ctx[9].secPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: /*game*/ ctx[9].secPlayer.toUpperCase()) + "";

    	let t2;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[8](/*game*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" vs. ");
    			t2 = text(t2_value);
    			attr_dev(button, "class", "btn btn-dark svelte-nf23x8");
    			add_location(button, file$b, 71, 16, 2752);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$userGames, $currUser*/ 6 && t0_value !== (t0_value = (/*game*/ ctx[9].priPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: /*game*/ ctx[9].priPlayer.toUpperCase()) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$userGames, $currUser*/ 6 && t2_value !== (t2_value = (/*game*/ ctx[9].secPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: /*game*/ ctx[9].secPlayer.toUpperCase()) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(71:12) {#if game.finished}",
    		ctx
    	});

    	return block;
    }

    // (70:8) {#each $userGames as game}
    function create_each_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*game*/ ctx[9].finished && create_if_block_3$1(ctx);

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
    			if (/*game*/ ctx[9].finished) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(70:8) {#each $userGames as game}",
    		ctx
    	});

    	return block;
    }

    // (77:8) {#if $ratio < 1}
    function create_if_block_2$5(ctx) {
    	let button;
    	let i;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			t = text(" Back");
    			attr_dev(i, "class", "fa fa-arrow-left");
    			add_location(i, file$b, 77, 80, 3158);
    			attr_dev(button, "class", "btn btn-dark svelte-nf23x8");
    			set_style(button, "width", "25%");
    			add_location(button, file$b, 77, 12, 3090);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);
    			append_dev(button, t);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", goBack$2, false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(77:8) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (82:8) {:else}
    function create_else_block_1$3(ctx) {
    	let h3;

    	let t0_value = (/*currGame*/ ctx[0].priPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: /*currGame*/ ctx[0].priPlayer.toUpperCase()) + "";

    	let t0;
    	let t1;

    	let t2_value = (/*currGame*/ ctx[0].secPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: "Unknown Player") + "";

    	let t2;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = text(" vs. ");
    			t2 = text(t2_value);
    			attr_dev(h3, "id", "versus");
    			attr_dev(h3, "class", "svelte-nf23x8");
    			add_location(h3, file$b, 82, 12, 3487);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currGame, $currUser*/ 5 && t0_value !== (t0_value = (/*currGame*/ ctx[0].priPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: /*currGame*/ ctx[0].priPlayer.toUpperCase()) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*currGame, $currUser*/ 5 && t2_value !== (t2_value = (/*currGame*/ ctx[0].secPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: "Unknown Player") + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$3.name,
    		type: "else",
    		source: "(82:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (80:8) {#if currGame.secPlayer != null}
    function create_if_block_1$5(ctx) {
    	let h3;

    	let t0_value = (/*currGame*/ ctx[0].priPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: /*currGame*/ ctx[0].priPlayer.toUpperCase()) + "";

    	let t0;
    	let t1;

    	let t2_value = (/*currGame*/ ctx[0].secPlayer == /*$currUser*/ ctx[2].name
    	? "Me"
    	: /*currGame*/ ctx[0].secPlayer.toUpperCase()) + "";

    	let t2;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = text(" vs. ");
    			t2 = text(t2_value);
    			attr_dev(h3, "id", "versus");
    			attr_dev(h3, "class", "svelte-nf23x8");
    			add_location(h3, file$b, 80, 12, 3272);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currGame, $currUser*/ 5 && t0_value !== (t0_value = (/*currGame*/ ctx[0].priPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: /*currGame*/ ctx[0].priPlayer.toUpperCase()) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*currGame, $currUser*/ 5 && t2_value !== (t2_value = (/*currGame*/ ctx[0].secPlayer == /*$currUser*/ ctx[2].name
    			? "Me"
    			: /*currGame*/ ctx[0].secPlayer.toUpperCase()) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(80:8) {#if currGame.secPlayer != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$userGames*/ ctx[1].length == 0) return create_if_block$8;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function goBack$2() {
    	let list = document.getElementById("gameList");
    	let detail = document.getElementById("gameDetails");
    	list.setAttribute("style", "left:0");
    	detail.setAttribute("style", "left:100%");
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $userGames;
    	let $currUser;
    	let $ratio;
    	validate_store(userGames, "userGames");
    	component_subscribe($$self, userGames, $$value => $$invalidate(1, $userGames = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(2, $currUser = $$value));
    	validate_store(ratio, "ratio");
    	component_subscribe($$self, ratio, $$value => $$invalidate(3, $ratio = $$value));
    	let currGame = $userGames.length > 0 ? $userGames[0] : null;

    	function viewGameDetails(game) {
    		if (screen.width <= 800) {
    			let list = document.getElementById("gameList");
    			let detail = document.getElementById("gameDetails");
    			list.setAttribute("style", "left:-100%");
    			detail.setAttribute("style", "left:0");
    		}

    		$$invalidate(0, currGame = game);
    	}

    	function getGame() {
    		if (currGame.gameHistory.length == 0) {
    			if (currGame.priEmail == $currUser.email) gameBoard.set(new Board(null, false)); else gameBoard.set(new Board(null, true));
    		} else {
    			gameBoard.set(new Board(currGame.gameHistory[currGame.gameHistory.length - 1], null));
    		}

    		$$invalidate(0, currGame.side = currGame.priEmail == $currUser.email ? "red" : "black", currGame);
    		let initiator = currGame.priEmail == $currUser.email ? true : false;
    		gamePref.set(new Game(currGame, gameHistory, initiator));
    		bigPopUp.set(false);
    		viewGameList.set(false);
    		gameTab.set(5);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameList> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameList", $$slots, []);
    	const click_handler = game => viewGameDetails(game);
    	const click_handler_1 = game => viewGameDetails(game);
    	const click_handler_2 = game => viewGameDetails(game);

    	$$self.$capture_state = () => ({
    		userGames,
    		gamePref,
    		page,
    		gameTab,
    		currUser,
    		gameBoard,
    		gameHistory,
    		viewGameList,
    		bigPopUp,
    		currSocket,
    		ratio,
    		Board,
    		getUserGames,
    		Game,
    		currGame,
    		viewGameDetails,
    		goBack: goBack$2,
    		getGame,
    		$userGames,
    		$currUser,
    		$ratio
    	});

    	$$self.$inject_state = $$props => {
    		if ("currGame" in $$props) $$invalidate(0, currGame = $$props.currGame);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currGame,
    		$userGames,
    		$currUser,
    		$ratio,
    		viewGameDetails,
    		getGame,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class GameList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameList",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/Components/settings.svelte generated by Svelte v3.22.3 */

    const { console: console_1$6 } = globals;
    const file$c = "src/Components/settings.svelte";

    // (181:0) {#if $ratio > 1}
    function create_if_block_8$1(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Settings";
    			attr_dev(h3, "class", "svelte-1pwf662");
    			add_location(h3, file$c, 181, 4, 5128);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(181:0) {#if $ratio > 1}",
    		ctx
    	});

    	return block;
    }

    // (186:4) {#if $ratio < 1}
    function create_if_block_7$1(ctx) {
    	let button;
    	let t;
    	let i;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Game Prefernces ");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-arrow-right");
    			add_location(i, file$c, 186, 118, 5335);
    			attr_dev(button, "class", "btn btn-dark");
    			set_style(button, "float", "right");
    			set_style(button, "margin-top", "12.5px");
    			add_location(button, file$c, 186, 8, 5225);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			append_dev(button, i);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", viewGamePref, false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(186:4) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (209:4) {:else}
    function create_else_block_2$2(ctx) {
    	let current;
    	const loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$2.name,
    		type: "else",
    		source: "(209:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (207:4) {#if !loading}
    function create_if_block_6$1(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Update Profile";
    			attr_dev(button, "class", "btn btn-success middle svelte-1pwf662");
    			add_location(button, file$c, 207, 8, 6119);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*updateProfile*/ ctx[13], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(207:4) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (221:4) {:else}
    function create_else_block_1$4(ctx) {
    	let current;
    	const loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$4.name,
    		type: "else",
    		source: "(221:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (219:4) {#if !loading}
    function create_if_block_5$2(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Reset";
    			attr_dev(button, "class", "btn btn-success middle svelte-1pwf662");
    			add_location(button, file$c, 219, 8, 6518);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*resetPassword*/ ctx[14], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(219:4) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (225:4) {#if $ratio < 1}
    function create_if_block_4$2(ctx) {
    	let button;
    	let t0;
    	let t1_value = /*$currUser*/ ctx[10].name + "";
    	let t1;
    	let t2;
    	let i;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text("Logout (");
    			t1 = text(t1_value);
    			t2 = text(") ");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-sign-out");
    			add_location(i, file$c, 225, 93, 6754);
    			attr_dev(button, "class", "btn btn-danger middle svelte-1pwf662");
    			add_location(button, file$c, 225, 8, 6669);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, i);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*signOut*/ ctx[16], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$currUser*/ 1024 && t1_value !== (t1_value = /*$currUser*/ ctx[10].name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(225:4) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (231:4) {#if $ratio < 1}
    function create_if_block_3$2(ctx) {
    	let button;
    	let i;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			t = text(" Profile");
    			attr_dev(i, "class", "fa fa-arrow-left");
    			add_location(i, file$c, 231, 100, 6977);
    			attr_dev(button, "class", "btn btn-dark");
    			set_style(button, "float", "left");
    			set_style(button, "margin-top", "12.5px");
    			add_location(button, file$c, 231, 8, 6885);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);
    			append_dev(button, t);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", viewProfile, false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(231:4) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (248:8) {#if $ratio < 1}
    function create_if_block_2$6(ctx) {
    	let br0;
    	let br1;

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			br1 = element("br");
    			add_location(br0, file$c, 248, 12, 7444);
    			add_location(br1, file$c, 248, 17, 7449);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(248:8) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (292:8) {#if $ratio < 1}
    function create_if_block_1$6(ctx) {
    	let br0;
    	let br1;

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			br1 = element("br");
    			add_location(br0, file$c, 292, 12, 9503);
    			add_location(br1, file$c, 292, 17, 9508);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(292:8) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (320:4) {:else}
    function create_else_block$7(ctx) {
    	let current;
    	const loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(320:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (318:4) {#if !loading}
    function create_if_block$9(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Save Preferences";
    			attr_dev(button, "id", "saveBtn");
    			attr_dev(button, "class", "btn btn-primary middle svelte-1pwf662");
    			add_location(button, file$c, 318, 8, 10760);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*updateGamePref*/ ctx[15], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(318:4) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let t0;
    	let div1;
    	let t1;
    	let h50;
    	let t3;
    	let h60;
    	let t4;
    	let span;
    	let t5_value = /*$currUser*/ ctx[10].email + "";
    	let t5;
    	let t6;
    	let img;
    	let img_src_value;
    	let t7;
    	let div0;
    	let input0;
    	let t8;
    	let label0;
    	let t9;
    	let t10;
    	let p;
    	let t12;
    	let input1;
    	let t13;
    	let input2;
    	let t14;
    	let current_block_type_index;
    	let if_block2;
    	let t15;
    	let h51;
    	let t17;
    	let input3;
    	let t18;
    	let input4;
    	let t19;
    	let current_block_type_index_1;
    	let if_block3;
    	let t20;
    	let t21;
    	let div12;
    	let t22;
    	let h52;
    	let t24;
    	let h61;
    	let t25;
    	let input5;
    	let t26;
    	let h62;
    	let t27;
    	let input6;
    	let t28;
    	let hr0;
    	let t29;
    	let h63;
    	let t30;
    	let t31;
    	let div2;
    	let input7;
    	let t32;
    	let label1;
    	let t34;
    	let div3;
    	let input8;
    	let t35;
    	let label2;
    	let t37;
    	let div4;
    	let input9;
    	let t38;
    	let label3;
    	let t40;
    	let div5;
    	let input10;
    	let t41;
    	let label4;
    	let t43;
    	let h64;
    	let t44;
    	let t45;
    	let t46;
    	let input11;
    	let t47;
    	let hr1;
    	let t48;
    	let h65;
    	let t49;
    	let div6;
    	let input12;
    	let t50;
    	let label5;
    	let t52;
    	let div7;
    	let input13;
    	let t53;
    	let label6;
    	let t55;
    	let hr2;
    	let t56;
    	let h66;
    	let t57;
    	let t58;
    	let div8;
    	let input14;
    	let t59;
    	let label7;
    	let t61;
    	let div9;
    	let input15;
    	let t62;
    	let label8;
    	let t64;
    	let div10;
    	let input16;
    	let t65;
    	let label9;
    	let t67;
    	let div11;
    	let input17;
    	let t68;
    	let label10;
    	let t70;
    	let hr3;
    	let t71;
    	let current_block_type_index_2;
    	let if_block8;
    	let current;
    	let dispose;
    	let if_block0 = /*$ratio*/ ctx[11] > 1 && create_if_block_8$1(ctx);
    	let if_block1 = /*$ratio*/ ctx[11] < 1 && create_if_block_7$1(ctx);
    	const if_block_creators = [create_if_block_6$1, create_else_block_2$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*loading*/ ctx[9]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_5$2, create_else_block_1$4];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*loading*/ ctx[9]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	let if_block4 = /*$ratio*/ ctx[11] < 1 && create_if_block_4$2(ctx);
    	let if_block5 = /*$ratio*/ ctx[11] < 1 && create_if_block_3$2(ctx);
    	let if_block6 = /*$ratio*/ ctx[11] < 1 && create_if_block_2$6(ctx);
    	let if_block7 = /*$ratio*/ ctx[11] < 1 && create_if_block_1$6(ctx);
    	const if_block_creators_2 = [create_if_block$9, create_else_block$7];
    	const if_blocks_2 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (!/*loading*/ ctx[9]) return 0;
    		return 1;
    	}

    	current_block_type_index_2 = select_block_type_2(ctx);
    	if_block8 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			h50 = element("h5");
    			h50.textContent = "Profile";
    			t3 = space();
    			h60 = element("h6");
    			t4 = text("Account ID: ");
    			span = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			img = element("img");
    			t7 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t8 = space();
    			label0 = element("label");
    			t9 = text(/*imageLabel*/ ctx[5]);
    			t10 = space();
    			p = element("p");
    			p.textContent = "Image size should be less than 1MB";
    			t12 = space();
    			input1 = element("input");
    			t13 = space();
    			input2 = element("input");
    			t14 = space();
    			if_block2.c();
    			t15 = space();
    			h51 = element("h5");
    			h51.textContent = "Reset Password";
    			t17 = space();
    			input3 = element("input");
    			t18 = space();
    			input4 = element("input");
    			t19 = space();
    			if_block3.c();
    			t20 = space();
    			if (if_block4) if_block4.c();
    			t21 = space();
    			div12 = element("div");
    			if (if_block5) if_block5.c();
    			t22 = space();
    			h52 = element("h5");
    			h52.textContent = "Game Preferences";
    			t24 = space();
    			h61 = element("h6");
    			t25 = text("My Checker Color:\n        ");
    			input5 = element("input");
    			t26 = space();
    			h62 = element("h6");
    			t27 = text("Other Player's Checker Color: \n        ");
    			input6 = element("input");
    			t28 = space();
    			hr0 = element("hr");
    			t29 = space();
    			h63 = element("h6");
    			t30 = text("Time Per Turn versus Computer:\n        ");
    			if (if_block6) if_block6.c();
    			t31 = space();
    			div2 = element("div");
    			input7 = element("input");
    			t32 = space();
    			label1 = element("label");
    			label1.textContent = "15";
    			t34 = space();
    			div3 = element("div");
    			input8 = element("input");
    			t35 = space();
    			label2 = element("label");
    			label2.textContent = "30";
    			t37 = space();
    			div4 = element("div");
    			input9 = element("input");
    			t38 = space();
    			label3 = element("label");
    			label3.textContent = "45";
    			t40 = space();
    			div5 = element("div");
    			input10 = element("input");
    			t41 = space();
    			label4 = element("label");
    			label4.textContent = "60";
    			t43 = space();
    			h64 = element("h6");
    			t44 = text(/*compTime*/ ctx[8]);
    			t45 = text(" seconds");
    			t46 = space();
    			input11 = element("input");
    			t47 = space();
    			hr1 = element("hr");
    			t48 = space();
    			h65 = element("h6");
    			t49 = text("Board Orientation:\n        ");
    			div6 = element("div");
    			input12 = element("input");
    			t50 = space();
    			label5 = element("label");
    			label5.textContent = "2D";
    			t52 = space();
    			div7 = element("div");
    			input13 = element("input");
    			t53 = space();
    			label6 = element("label");
    			label6.textContent = "3D";
    			t55 = space();
    			hr2 = element("hr");
    			t56 = space();
    			h66 = element("h6");
    			t57 = text("Difficulty Level versus Computer:\n        ");
    			if (if_block7) if_block7.c();
    			t58 = space();
    			div8 = element("div");
    			input14 = element("input");
    			t59 = space();
    			label7 = element("label");
    			label7.textContent = "Easy";
    			t61 = space();
    			div9 = element("div");
    			input15 = element("input");
    			t62 = space();
    			label8 = element("label");
    			label8.textContent = "Medium";
    			t64 = space();
    			div10 = element("div");
    			input16 = element("input");
    			t65 = space();
    			label9 = element("label");
    			label9.textContent = "Hard";
    			t67 = space();
    			div11 = element("div");
    			input17 = element("input");
    			t68 = space();
    			label10 = element("label");
    			label10.textContent = "Legend";
    			t70 = space();
    			hr3 = element("hr");
    			t71 = space();
    			if_block8.c();
    			set_style(h50, "text-align", "center");
    			attr_dev(h50, "class", "svelte-1pwf662");
    			add_location(h50, file$c, 189, 4, 5393);
    			add_location(span, file$c, 191, 47, 5484);
    			set_style(h60, "text-align", "center");
    			add_location(h60, file$c, 191, 4, 5441);
    			attr_dev(img, "alt", "propic");
    			if (img.src !== (img_src_value = /*Picture*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1pwf662");
    			add_location(img, file$c, 193, 4, 5525);
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "accept", "image/jpeg");
    			attr_dev(input0, "class", "custom-file-input svelte-1pwf662");
    			attr_dev(input0, "id", "customFile");
    			add_location(input0, file$c, 196, 8, 5624);
    			attr_dev(label0, "class", "custom-file-label");
    			attr_dev(label0, "for", "customFile");
    			add_location(label0, file$c, 197, 8, 5735);
    			attr_dev(div0, "id", "propic");
    			attr_dev(div0, "class", "custom-file input-group svelte-1pwf662");
    			add_location(div0, file$c, 195, 4, 5566);
    			set_style(p, "text-align", "center");
    			add_location(p, file$c, 200, 4, 5822);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "inlineFormInputGroup");
    			attr_dev(input1, "placeholder", "Display Name");
    			attr_dev(input1, "class", "svelte-1pwf662");
    			add_location(input1, file$c, 202, 4, 5895);
    			attr_dev(input2, "id", "authPass");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "placeholder", "Account Password");
    			attr_dev(input2, "class", "svelte-1pwf662");
    			add_location(input2, file$c, 204, 4, 5993);
    			set_style(h51, "margin-top", "60px");
    			set_style(h51, "text-align", "center");
    			attr_dev(h51, "class", "svelte-1pwf662");
    			add_location(h51, file$c, 212, 4, 6254);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "placeholder", "Account Password");
    			attr_dev(input3, "class", "svelte-1pwf662");
    			add_location(input3, file$c, 214, 4, 6325);
    			attr_dev(input4, "type", "password");
    			attr_dev(input4, "placeholder", "New Password");
    			attr_dev(input4, "class", "svelte-1pwf662");
    			add_location(input4, file$c, 216, 4, 6412);
    			attr_dev(div1, "id", "leftSet");
    			attr_dev(div1, "class", "container-fluid svelte-1pwf662");
    			add_location(div1, file$c, 184, 0, 5153);
    			set_style(h52, "text-align", "center");
    			set_style(h52, "margin-bottom", "20px");
    			attr_dev(h52, "class", "svelte-1pwf662");
    			add_location(h52, file$c, 234, 4, 7042);
    			attr_dev(input5, "type", "color");
    			add_location(input5, file$c, 237, 8, 7149);
    			add_location(h61, file$c, 236, 4, 7119);
    			attr_dev(input6, "type", "color");
    			add_location(input6, file$c, 241, 8, 7277);
    			set_style(h62, "margin-top", "20px");
    			add_location(h62, file$c, 240, 4, 7209);
    			attr_dev(hr0, "class", "svelte-1pwf662");
    			add_location(hr0, file$c, 244, 4, 7341);
    			attr_dev(input7, "class", "form-check-input");
    			attr_dev(input7, "type", "radio");
    			attr_dev(input7, "name", "inlineRadioOptions");
    			attr_dev(input7, "id", "inlineRadio1");
    			add_location(input7, file$c, 251, 12, 7532);
    			attr_dev(label1, "class", "form-check-label");
    			attr_dev(label1, "for", "inlineRadio1");
    			add_location(label1, file$c, 252, 12, 7669);
    			attr_dev(div2, "class", "form-check form-check-inline svelte-1pwf662");
    			add_location(div2, file$c, 250, 8, 7477);
    			attr_dev(input8, "class", "form-check-input");
    			attr_dev(input8, "type", "radio");
    			attr_dev(input8, "name", "inlineRadioOptions");
    			attr_dev(input8, "id", "inlineRadio2");
    			add_location(input8, file$c, 256, 12, 7810);
    			attr_dev(label2, "class", "form-check-label");
    			attr_dev(label2, "for", "inlineRadio2");
    			add_location(label2, file$c, 257, 12, 7947);
    			attr_dev(div3, "class", "form-check form-check-inline svelte-1pwf662");
    			add_location(div3, file$c, 255, 8, 7755);
    			attr_dev(input9, "class", "form-check-input");
    			attr_dev(input9, "type", "radio");
    			attr_dev(input9, "name", "inlineRadioOptions");
    			attr_dev(input9, "id", "inlineRadio3");
    			add_location(input9, file$c, 261, 12, 8088);
    			attr_dev(label3, "class", "form-check-label");
    			attr_dev(label3, "for", "inlineRadio3");
    			add_location(label3, file$c, 262, 12, 8225);
    			attr_dev(div4, "class", "form-check form-check-inline svelte-1pwf662");
    			add_location(div4, file$c, 260, 8, 8033);
    			attr_dev(input10, "class", "form-check-input");
    			attr_dev(input10, "type", "radio");
    			attr_dev(input10, "name", "inlineRadioOptions");
    			attr_dev(input10, "id", "inlineRadio3");
    			add_location(input10, file$c, 266, 12, 8366);
    			attr_dev(label4, "class", "form-check-label");
    			attr_dev(label4, "for", "inlineRadio3");
    			add_location(label4, file$c, 267, 12, 8503);
    			attr_dev(div5, "class", "form-check form-check-inline svelte-1pwf662");
    			add_location(div5, file$c, 265, 8, 8311);
    			set_style(h63, "width", "100%");
    			add_location(h63, file$c, 246, 4, 7352);
    			set_style(h64, "width", "100%");
    			set_style(h64, "text-align", "center");
    			set_style(h64, "margin-top", "20px");
    			add_location(h64, file$c, 271, 4, 8595);
    			attr_dev(input11, "class", "custom-range");
    			attr_dev(input11, "type", "range");
    			attr_dev(input11, "min", "15");
    			attr_dev(input11, "max", "60");
    			attr_dev(input11, "step", "1");
    			add_location(input11, file$c, 272, 4, 8681);
    			attr_dev(hr1, "class", "svelte-1pwf662");
    			add_location(hr1, file$c, 274, 4, 8779);
    			attr_dev(input12, "class", "form-check-input");
    			attr_dev(input12, "type", "radio");
    			attr_dev(input12, "name", "inlineRadio");
    			attr_dev(input12, "id", "inlineRadio4");
    			add_location(input12, file$c, 278, 12, 8896);
    			attr_dev(label5, "class", "form-check-label");
    			attr_dev(label5, "for", "inlineRadio2");
    			add_location(label5, file$c, 279, 12, 9030);
    			attr_dev(div6, "class", "form-check form-check-inline svelte-1pwf662");
    			add_location(div6, file$c, 277, 8, 8841);
    			attr_dev(input13, "class", "form-check-input");
    			attr_dev(input13, "type", "radio");
    			attr_dev(input13, "name", "inlineRadio");
    			attr_dev(input13, "id", "inlineRadio5");
    			add_location(input13, file$c, 283, 12, 9171);
    			attr_dev(label6, "class", "form-check-label");
    			attr_dev(label6, "for", "inlineRadio3");
    			add_location(label6, file$c, 284, 12, 9305);
    			attr_dev(div7, "class", "form-check form-check-inline svelte-1pwf662");
    			add_location(div7, file$c, 282, 8, 9116);
    			set_style(h65, "width", "100%");
    			add_location(h65, file$c, 276, 4, 8790);
    			attr_dev(hr2, "class", "svelte-1pwf662");
    			add_location(hr2, file$c, 288, 4, 9397);
    			attr_dev(input14, "class", "form-check-input");
    			attr_dev(input14, "type", "radio");
    			attr_dev(input14, "name", "inlineRadioOptions");
    			attr_dev(input14, "id", "inlineRadio6");
    			add_location(input14, file$c, 295, 12, 9601);
    			attr_dev(label7, "class", "form-check-label");
    			attr_dev(label7, "for", "inlineRadio1");
    			add_location(label7, file$c, 296, 12, 9743);
    			attr_dev(div8, "class", "form-check form-check-inline oda-check svelte-1pwf662");
    			add_location(div8, file$c, 294, 8, 9536);
    			attr_dev(input15, "class", "form-check-input");
    			attr_dev(input15, "type", "radio");
    			attr_dev(input15, "name", "inlineRadioOptions");
    			attr_dev(input15, "id", "inlineRadio7");
    			add_location(input15, file$c, 300, 12, 9896);
    			attr_dev(label8, "class", "form-check-label");
    			attr_dev(label8, "for", "inlineRadio2");
    			add_location(label8, file$c, 301, 12, 10038);
    			attr_dev(div9, "class", "form-check form-check-inline oda-check svelte-1pwf662");
    			add_location(div9, file$c, 299, 8, 9831);
    			attr_dev(input16, "class", "form-check-input");
    			attr_dev(input16, "type", "radio");
    			attr_dev(input16, "name", "inlineRadioOptions");
    			attr_dev(input16, "id", "inlineRadio8");
    			add_location(input16, file$c, 305, 12, 10193);
    			attr_dev(label9, "class", "form-check-label");
    			attr_dev(label9, "for", "inlineRadio3");
    			add_location(label9, file$c, 306, 12, 10335);
    			attr_dev(div10, "class", "form-check form-check-inline oda-check svelte-1pwf662");
    			add_location(div10, file$c, 304, 8, 10128);
    			attr_dev(input17, "class", "form-check-input");
    			attr_dev(input17, "type", "radio");
    			attr_dev(input17, "name", "inlineRadioOptions");
    			attr_dev(input17, "id", "inlineRadio9");
    			add_location(input17, file$c, 310, 12, 10488);
    			attr_dev(label10, "class", "form-check-label");
    			attr_dev(label10, "for", "inlineRadio3");
    			add_location(label10, file$c, 311, 12, 10630);
    			attr_dev(div11, "class", "form-check form-check-inline oda-check svelte-1pwf662");
    			add_location(div11, file$c, 309, 8, 10423);
    			set_style(h66, "width", "100%");
    			add_location(h66, file$c, 290, 4, 9408);
    			attr_dev(hr3, "class", "svelte-1pwf662");
    			add_location(hr3, file$c, 315, 4, 10726);
    			attr_dev(div12, "id", "rightSet");
    			attr_dev(div12, "class", "container-fluid svelte-1pwf662");
    			add_location(div12, file$c, 229, 0, 6812);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, h50);
    			append_dev(div1, t3);
    			append_dev(div1, h60);
    			append_dev(h60, t4);
    			append_dev(h60, span);
    			append_dev(span, t5);
    			append_dev(div1, t6);
    			append_dev(div1, img);
    			append_dev(div1, t7);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			append_dev(div0, t8);
    			append_dev(div0, label0);
    			append_dev(label0, t9);
    			append_dev(div1, t10);
    			append_dev(div1, p);
    			append_dev(div1, t12);
    			append_dev(div1, input1);
    			set_input_value(input1, /*Name*/ ctx[0]);
    			append_dev(div1, t13);
    			append_dev(div1, input2);
    			set_input_value(input2, /*authPassword*/ ctx[2]);
    			append_dev(div1, t14);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div1, t15);
    			append_dev(div1, h51);
    			append_dev(div1, t17);
    			append_dev(div1, input3);
    			set_input_value(input3, /*oldPassword*/ ctx[3]);
    			append_dev(div1, t18);
    			append_dev(div1, input4);
    			set_input_value(input4, /*newPassword*/ ctx[4]);
    			append_dev(div1, t19);
    			if_blocks_1[current_block_type_index_1].m(div1, null);
    			append_dev(div1, t20);
    			if (if_block4) if_block4.m(div1, null);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, div12, anchor);
    			if (if_block5) if_block5.m(div12, null);
    			append_dev(div12, t22);
    			append_dev(div12, h52);
    			append_dev(div12, t24);
    			append_dev(div12, h61);
    			append_dev(h61, t25);
    			append_dev(h61, input5);
    			set_input_value(input5, /*myColor*/ ctx[6]);
    			append_dev(div12, t26);
    			append_dev(div12, h62);
    			append_dev(h62, t27);
    			append_dev(h62, input6);
    			set_input_value(input6, /*otherColor*/ ctx[7]);
    			append_dev(div12, t28);
    			append_dev(div12, hr0);
    			append_dev(div12, t29);
    			append_dev(div12, h63);
    			append_dev(h63, t30);
    			if (if_block6) if_block6.m(h63, null);
    			append_dev(h63, t31);
    			append_dev(h63, div2);
    			append_dev(div2, input7);
    			append_dev(div2, t32);
    			append_dev(div2, label1);
    			append_dev(h63, t34);
    			append_dev(h63, div3);
    			append_dev(div3, input8);
    			append_dev(div3, t35);
    			append_dev(div3, label2);
    			append_dev(h63, t37);
    			append_dev(h63, div4);
    			append_dev(div4, input9);
    			append_dev(div4, t38);
    			append_dev(div4, label3);
    			append_dev(h63, t40);
    			append_dev(h63, div5);
    			append_dev(div5, input10);
    			append_dev(div5, t41);
    			append_dev(div5, label4);
    			append_dev(div12, t43);
    			append_dev(div12, h64);
    			append_dev(h64, t44);
    			append_dev(h64, t45);
    			append_dev(div12, t46);
    			append_dev(div12, input11);
    			set_input_value(input11, /*compTime*/ ctx[8]);
    			append_dev(div12, t47);
    			append_dev(div12, hr1);
    			append_dev(div12, t48);
    			append_dev(div12, h65);
    			append_dev(h65, t49);
    			append_dev(h65, div6);
    			append_dev(div6, input12);
    			append_dev(div6, t50);
    			append_dev(div6, label5);
    			append_dev(h65, t52);
    			append_dev(h65, div7);
    			append_dev(div7, input13);
    			append_dev(div7, t53);
    			append_dev(div7, label6);
    			append_dev(div12, t55);
    			append_dev(div12, hr2);
    			append_dev(div12, t56);
    			append_dev(div12, h66);
    			append_dev(h66, t57);
    			if (if_block7) if_block7.m(h66, null);
    			append_dev(h66, t58);
    			append_dev(h66, div8);
    			append_dev(div8, input14);
    			append_dev(div8, t59);
    			append_dev(div8, label7);
    			append_dev(h66, t61);
    			append_dev(h66, div9);
    			append_dev(div9, input15);
    			append_dev(div9, t62);
    			append_dev(div9, label8);
    			append_dev(h66, t64);
    			append_dev(h66, div10);
    			append_dev(div10, input16);
    			append_dev(div10, t65);
    			append_dev(div10, label9);
    			append_dev(h66, t67);
    			append_dev(h66, div11);
    			append_dev(div11, input17);
    			append_dev(div11, t68);
    			append_dev(div11, label10);
    			append_dev(div12, t70);
    			append_dev(div12, hr3);
    			append_dev(div12, t71);
    			if_blocks_2[current_block_type_index_2].m(div12, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "change", /*upload*/ ctx[12], false, false, false),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[24]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[25]),
    				listen_dev(input3, "input", /*input3_input_handler*/ ctx[26]),
    				listen_dev(input4, "input", /*input4_input_handler*/ ctx[27]),
    				listen_dev(input5, "input", /*input5_input_handler*/ ctx[28]),
    				listen_dev(input6, "input", /*input6_input_handler*/ ctx[29]),
    				listen_dev(input7, "change", /*change_handler*/ ctx[30], false, false, false),
    				listen_dev(input8, "change", /*change_handler_1*/ ctx[31], false, false, false),
    				listen_dev(input9, "change", /*change_handler_2*/ ctx[32], false, false, false),
    				listen_dev(input10, "change", /*change_handler_3*/ ctx[33], false, false, false),
    				listen_dev(input11, "change", /*input11_change_input_handler*/ ctx[34]),
    				listen_dev(input11, "input", /*input11_change_input_handler*/ ctx[34]),
    				listen_dev(input12, "change", /*change_handler_4*/ ctx[35], false, false, false),
    				listen_dev(input13, "change", /*change_handler_5*/ ctx[36], false, false, false),
    				listen_dev(input14, "change", /*change_handler_6*/ ctx[37], false, false, false),
    				listen_dev(input15, "change", /*change_handler_7*/ ctx[38], false, false, false),
    				listen_dev(input16, "change", /*change_handler_8*/ ctx[39], false, false, false),
    				listen_dev(input17, "change", /*change_handler_9*/ ctx[40], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (/*$ratio*/ ctx[11] > 1) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_8$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$ratio*/ ctx[11] < 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_7$1(ctx);
    					if_block1.c();
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if ((!current || dirty[0] & /*$currUser*/ 1024) && t5_value !== (t5_value = /*$currUser*/ ctx[10].email + "")) set_data_dev(t5, t5_value);

    			if (!current || dirty[0] & /*Picture*/ 2 && img.src !== (img_src_value = /*Picture*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty[0] & /*imageLabel*/ 32) set_data_dev(t9, /*imageLabel*/ ctx[5]);

    			if (dirty[0] & /*Name*/ 1 && input1.value !== /*Name*/ ctx[0]) {
    				set_input_value(input1, /*Name*/ ctx[0]);
    			}

    			if (dirty[0] & /*authPassword*/ 4 && input2.value !== /*authPassword*/ ctx[2]) {
    				set_input_value(input2, /*authPassword*/ ctx[2]);
    			}

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
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div1, t15);
    			}

    			if (dirty[0] & /*oldPassword*/ 8 && input3.value !== /*oldPassword*/ ctx[3]) {
    				set_input_value(input3, /*oldPassword*/ ctx[3]);
    			}

    			if (dirty[0] & /*newPassword*/ 16 && input4.value !== /*newPassword*/ ctx[4]) {
    				set_input_value(input4, /*newPassword*/ ctx[4]);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block3 = if_blocks_1[current_block_type_index_1];

    				if (!if_block3) {
    					if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block3.c();
    				}

    				transition_in(if_block3, 1);
    				if_block3.m(div1, t20);
    			}

    			if (/*$ratio*/ ctx[11] < 1) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_4$2(ctx);
    					if_block4.c();
    					if_block4.m(div1, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*$ratio*/ ctx[11] < 1) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_3$2(ctx);
    					if_block5.c();
    					if_block5.m(div12, t22);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (dirty[0] & /*myColor*/ 64) {
    				set_input_value(input5, /*myColor*/ ctx[6]);
    			}

    			if (dirty[0] & /*otherColor*/ 128) {
    				set_input_value(input6, /*otherColor*/ ctx[7]);
    			}

    			if (/*$ratio*/ ctx[11] < 1) {
    				if (if_block6) ; else {
    					if_block6 = create_if_block_2$6(ctx);
    					if_block6.c();
    					if_block6.m(h63, t31);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (!current || dirty[0] & /*compTime*/ 256) set_data_dev(t44, /*compTime*/ ctx[8]);

    			if (dirty[0] & /*compTime*/ 256) {
    				set_input_value(input11, /*compTime*/ ctx[8]);
    			}

    			if (/*$ratio*/ ctx[11] < 1) {
    				if (if_block7) ; else {
    					if_block7 = create_if_block_1$6(ctx);
    					if_block7.c();
    					if_block7.m(h66, t58);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			let previous_block_index_2 = current_block_type_index_2;
    			current_block_type_index_2 = select_block_type_2(ctx);

    			if (current_block_type_index_2 === previous_block_index_2) {
    				if_blocks_2[current_block_type_index_2].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_2[previous_block_index_2], 1, 1, () => {
    					if_blocks_2[previous_block_index_2] = null;
    				});

    				check_outros();
    				if_block8 = if_blocks_2[current_block_type_index_2];

    				if (!if_block8) {
    					if_block8 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    					if_block8.c();
    				}

    				transition_in(if_block8, 1);
    				if_block8.m(div12, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block8);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block8);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (if_block1) if_block1.d();
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();
    			if (if_block4) if_block4.d();
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(div12);
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if_blocks_2[current_block_type_index_2].d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function viewGamePref() {
    	let profile = document.getElementById("leftSet");
    	let game = document.getElementById("rightSet");
    	profile.setAttribute("style", "left:-100%");
    	game.setAttribute("style", "left:0");
    }

    function viewProfile() {
    	let profile = document.getElementById("leftSet");
    	let game = document.getElementById("rightSet");
    	game.setAttribute("style", "left:100%");
    	profile.setAttribute("style", "left:0");
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $currUser;
    	let $currSocket;
    	let $ratio;
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(10, $currUser = $$value));
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(23, $currSocket = $$value));
    	validate_store(ratio, "ratio");
    	component_subscribe($$self, ratio, $$value => $$invalidate(11, $ratio = $$value));
    	let Name = $currUser.name;
    	let Picture = $currUser.picture;
    	let authPassword;
    	let oldPassword, newPassword;
    	let imageLabel = "Choose Profile Photo";

    	let myColor = $currUser.gamePref.myColor,
    		otherColor = $currUser.gamePref.otherColor;

    	let compTime = $currUser.gamePref.compTime;
    	let myOrient = $currUser.gamePref.orient;
    	let difficulty = 0;
    	let request;
    	let loading = false;

    	function upload() {
    		if (e.target.files[0].size <= 1000000 && e.target.files[0].type == "image/jpeg") {
    			var reader = new FileReader();

    			reader.onload = function (e) {
    				$$invalidate(1, Picture = e.target.result);

    				currUser.update(state => {
    					state.picture = e.target.result;
    					return state;
    				});
    			};

    			reader.readAsDataURL(e.target.files[0]);
    			$$invalidate(5, imageLabel = e.target.files[0].name);
    		}
    	}

    	function updateProfile() {
    		if (Name != null && authPassword != null) {
    			$$invalidate(9, loading = true);

    			request = {
    				func: "updateProfile",
    				name: Name,
    				picture: Picture.includes("adorable") ? null : Picture,
    				password: authPassword,
    				email: $currUser.email
    			};

    			invokeFunction(request).then(response => {
    				if (response.msg != null && response.msg == "SUCCESS") {
    					console.log(response.msg);
    					$$invalidate(2, authPassword = "");

    					currUser.update(state => {
    						state.name = Name;
    						return state;
    					});

    					$$invalidate(9, loading = false);
    				} else {
    					$$invalidate(9, loading = false);
    					console.log(response.err);
    				}
    			}).catch(error => {
    				$$invalidate(9, loading = false);
    				console.log(error);
    			});
    		}
    	}

    	function resetPassword() {
    		if (oldPassword != null && newPassword != null && oldPassword != newPassword) {
    			$$invalidate(9, loading = true);

    			request = {
    				func: "resetPassword",
    				email: $currUser.email,
    				password: oldPassword,
    				newPass: newPassword
    			};

    			invokeFunction(request).then(response => {
    				if (response.msg != null) {
    					console.log(response.msg);
    					$$invalidate(9, loading = false);
    					($$invalidate(3, oldPassword = ""), $$invalidate(4, newPassword = ""));
    				} else {
    					$$invalidate(9, loading = false);
    					console.log(response.err);
    				}
    			}).catch(error => {
    				$$invalidate(9, loading = false);
    				console.log(error);
    			});
    		}
    	}

    	function updateGamePref() {
    		if (myColor != otherColor) {
    			$$invalidate(9, loading = true);

    			request = {
    				func: "updateGamePref",
    				orient: myOrient,
    				compTime,
    				myColor,
    				otherColor
    			};

    			invokeFunction(request).then(response => {
    				if (response.msg != null && response.msg == "SUCCESS") {
    					console.log(response.msg);
    					$$invalidate(9, loading = false);

    					currUser.update(state => {
    						state.gamePref.myColor = myColor;
    						state.gamePref.otherColor = otherColor;
    						state.gamePref.compTime = compTime;
    						state.gamePref.orient = myOrient;
    						return state;
    					});
    				} else {
    					$$invalidate(9, loading = false);
    					console.log(response.err);
    				}
    			}).catch(error => {
    				$$invalidate(9, loading = false);
    				console.log(error);
    			});
    		} else {
    			console.log("Same Color");
    		}
    	}

    	function signOut() {
    		$currSocket.emit("go-offline", $currUser.email);
    		currUser.set(null);
    		gameTab.set(0);
    	}

    	function selectTime(time) {
    		$$invalidate(8, compTime = time);
    	}

    	function selectOrient(orient) {
    		myOrient = orient;
    	}

    	function selectDifficulty(diff) {
    		difficulty = diff;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Settings", $$slots, []);

    	function input1_input_handler() {
    		Name = this.value;
    		$$invalidate(0, Name);
    	}

    	function input2_input_handler() {
    		authPassword = this.value;
    		$$invalidate(2, authPassword);
    	}

    	function input3_input_handler() {
    		oldPassword = this.value;
    		$$invalidate(3, oldPassword);
    	}

    	function input4_input_handler() {
    		newPassword = this.value;
    		$$invalidate(4, newPassword);
    	}

    	function input5_input_handler() {
    		myColor = this.value;
    		$$invalidate(6, myColor);
    	}

    	function input6_input_handler() {
    		otherColor = this.value;
    		$$invalidate(7, otherColor);
    	}

    	const change_handler = () => selectTime(15);
    	const change_handler_1 = () => selectTime(30);
    	const change_handler_2 = () => selectTime(45);
    	const change_handler_3 = () => selectTime(60);

    	function input11_change_input_handler() {
    		compTime = to_number(this.value);
    		$$invalidate(8, compTime);
    	}

    	const change_handler_4 = () => selectOrient("2D");
    	const change_handler_5 = () => selectOrient("3D");
    	const change_handler_6 = () => selectDifficulty(0);
    	const change_handler_7 = () => selectDifficulty(1);
    	const change_handler_8 = () => selectDifficulty(2);
    	const change_handler_9 = () => selectDifficulty(3);

    	$$self.$capture_state = () => ({
    		currUser,
    		currSocket,
    		gameTab,
    		ratio,
    		invokeFunction,
    		Loader,
    		Name,
    		Picture,
    		authPassword,
    		oldPassword,
    		newPassword,
    		imageLabel,
    		myColor,
    		otherColor,
    		compTime,
    		myOrient,
    		difficulty,
    		request,
    		loading,
    		upload,
    		updateProfile,
    		resetPassword,
    		updateGamePref,
    		signOut,
    		selectTime,
    		selectOrient,
    		selectDifficulty,
    		viewGamePref,
    		viewProfile,
    		$currUser,
    		$currSocket,
    		$ratio
    	});

    	$$self.$inject_state = $$props => {
    		if ("Name" in $$props) $$invalidate(0, Name = $$props.Name);
    		if ("Picture" in $$props) $$invalidate(1, Picture = $$props.Picture);
    		if ("authPassword" in $$props) $$invalidate(2, authPassword = $$props.authPassword);
    		if ("oldPassword" in $$props) $$invalidate(3, oldPassword = $$props.oldPassword);
    		if ("newPassword" in $$props) $$invalidate(4, newPassword = $$props.newPassword);
    		if ("imageLabel" in $$props) $$invalidate(5, imageLabel = $$props.imageLabel);
    		if ("myColor" in $$props) $$invalidate(6, myColor = $$props.myColor);
    		if ("otherColor" in $$props) $$invalidate(7, otherColor = $$props.otherColor);
    		if ("compTime" in $$props) $$invalidate(8, compTime = $$props.compTime);
    		if ("myOrient" in $$props) myOrient = $$props.myOrient;
    		if ("difficulty" in $$props) difficulty = $$props.difficulty;
    		if ("request" in $$props) request = $$props.request;
    		if ("loading" in $$props) $$invalidate(9, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		Name,
    		Picture,
    		authPassword,
    		oldPassword,
    		newPassword,
    		imageLabel,
    		myColor,
    		otherColor,
    		compTime,
    		loading,
    		$currUser,
    		$ratio,
    		upload,
    		updateProfile,
    		resetPassword,
    		updateGamePref,
    		signOut,
    		selectTime,
    		selectOrient,
    		selectDifficulty,
    		myOrient,
    		difficulty,
    		request,
    		$currSocket,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		change_handler,
    		change_handler_1,
    		change_handler_2,
    		change_handler_3,
    		input11_change_input_handler,
    		change_handler_4,
    		change_handler_5,
    		change_handler_6,
    		change_handler_7,
    		change_handler_8,
    		change_handler_9
    	];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/Components/leaderBoard.svelte generated by Svelte v3.22.3 */
    const file$d = "src/Components/leaderBoard.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (26:4) {#if $ratio < 1}
    function create_if_block_5$3(ctx) {
    	let button;
    	let i;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			t = text(" League");
    			attr_dev(i, "class", "fa fa-arrow-left");
    			add_location(i, file$d, 26, 104, 889);
    			attr_dev(button, "class", "btn btn-dark");
    			set_style(button, "float", "left");
    			set_style(button, "margin-top", "12.5px");
    			add_location(button, file$d, 26, 8, 793);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);
    			append_dev(button, t);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", viewLeagueTable, false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$3.name,
    		type: "if",
    		source: "(26:4) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (95:4) {#if $ratio < 1}
    function create_if_block_4$3(ctx) {
    	let button;
    	let t;
    	let i;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("My Stats ");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-arrow-right");
    			add_location(i, file$d, 95, 110, 3097);
    			attr_dev(button, "class", "btn btn-dark");
    			set_style(button, "float", "right");
    			set_style(button, "margin-top", "12.5px");
    			add_location(button, file$d, 95, 8, 2995);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			append_dev(button, i);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", viewMyStats, false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(95:4) {#if $ratio < 1}",
    		ctx
    	});

    	return block;
    }

    // (108:12) {#if $ratio > 1}
    function create_if_block_3$3(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			th.textContent = "Games";
    			attr_dev(th, "class", "svelte-hrke3z");
    			add_location(th, file$d, 108, 16, 3451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(108:12) {#if $ratio > 1}",
    		ctx
    	});

    	return block;
    }

    // (129:12) {:else}
    function create_else_block$8(ctx) {
    	let tr;
    	let th0;
    	let t0_value = /*i*/ ctx[6] + 1 + "";
    	let t0;
    	let t1;
    	let th1;
    	let t2_value = /*user*/ ctx[4].name + "";
    	let t2;
    	let t3;
    	let t4;
    	let th2;
    	let t5_value = /*user*/ ctx[4].wins + "";
    	let t5;
    	let t6;
    	let th3;
    	let t7_value = /*user*/ ctx[4].draws + "";
    	let t7;
    	let t8;
    	let th4;
    	let t9_value = /*user*/ ctx[4].losses + "";
    	let t9;
    	let t10;
    	let th5;
    	let t11_value = /*user*/ ctx[4].totalPoints + "";
    	let t11;
    	let t12;
    	let if_block = /*$ratio*/ ctx[0] > 1 && create_if_block_2$7(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			th1 = element("th");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			th2 = element("th");
    			t5 = text(t5_value);
    			t6 = space();
    			th3 = element("th");
    			t7 = text(t7_value);
    			t8 = space();
    			th4 = element("th");
    			t9 = text(t9_value);
    			t10 = space();
    			th5 = element("th");
    			t11 = text(t11_value);
    			t12 = space();
    			attr_dev(th0, "class", "svelte-hrke3z");
    			add_location(th0, file$d, 130, 20, 4164);
    			attr_dev(th1, "class", "svelte-hrke3z");
    			add_location(th1, file$d, 131, 20, 4201);
    			attr_dev(th2, "class", "svelte-hrke3z");
    			add_location(th2, file$d, 135, 20, 4357);
    			attr_dev(th3, "class", "svelte-hrke3z");
    			add_location(th3, file$d, 136, 20, 4398);
    			attr_dev(th4, "class", "svelte-hrke3z");
    			add_location(th4, file$d, 137, 20, 4440);
    			attr_dev(th5, "class", "svelte-hrke3z");
    			add_location(th5, file$d, 138, 20, 4483);
    			add_location(tr, file$d, 129, 16, 4139);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(th1, t2);
    			append_dev(tr, t3);
    			if (if_block) if_block.m(tr, null);
    			append_dev(tr, t4);
    			append_dev(tr, th2);
    			append_dev(th2, t5);
    			append_dev(tr, t6);
    			append_dev(tr, th3);
    			append_dev(th3, t7);
    			append_dev(tr, t8);
    			append_dev(tr, th4);
    			append_dev(th4, t9);
    			append_dev(tr, t10);
    			append_dev(tr, th5);
    			append_dev(th5, t11);
    			append_dev(tr, t12);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$leaderBoard*/ 4 && t2_value !== (t2_value = /*user*/ ctx[4].name + "")) set_data_dev(t2, t2_value);

    			if (/*$ratio*/ ctx[0] > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$7(ctx);
    					if_block.c();
    					if_block.m(tr, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$leaderBoard*/ 4 && t5_value !== (t5_value = /*user*/ ctx[4].wins + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*$leaderBoard*/ 4 && t7_value !== (t7_value = /*user*/ ctx[4].draws + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*$leaderBoard*/ 4 && t9_value !== (t9_value = /*user*/ ctx[4].losses + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*$leaderBoard*/ 4 && t11_value !== (t11_value = /*user*/ ctx[4].totalPoints + "")) set_data_dev(t11, t11_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(129:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (117:12) {#if user.name != $currUser.name}
    function create_if_block$a(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*i*/ ctx[6] + 1 + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*user*/ ctx[4].name + "";
    	let t2;
    	let t3;
    	let t4;
    	let td2;
    	let t5_value = /*user*/ ctx[4].wins + "";
    	let t5;
    	let t6;
    	let td3;
    	let t7_value = /*user*/ ctx[4].draws + "";
    	let t7;
    	let t8;
    	let td4;
    	let t9_value = /*user*/ ctx[4].losses + "";
    	let t9;
    	let t10;
    	let td5;
    	let t11_value = /*user*/ ctx[4].totalPoints + "";
    	let t11;
    	let t12;
    	let if_block = /*$ratio*/ ctx[0] > 1 && create_if_block_1$7(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			td2 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			td3 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td4 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			td5 = element("td");
    			t11 = text(t11_value);
    			t12 = space();
    			attr_dev(td0, "class", "svelte-hrke3z");
    			add_location(td0, file$d, 118, 20, 3734);
    			attr_dev(td1, "class", "svelte-hrke3z");
    			add_location(td1, file$d, 119, 20, 3771);
    			attr_dev(td2, "class", "svelte-hrke3z");
    			add_location(td2, file$d, 123, 20, 3927);
    			attr_dev(td3, "class", "svelte-hrke3z");
    			add_location(td3, file$d, 124, 20, 3968);
    			attr_dev(td4, "class", "svelte-hrke3z");
    			add_location(td4, file$d, 125, 20, 4010);
    			attr_dev(td5, "class", "svelte-hrke3z");
    			add_location(td5, file$d, 126, 20, 4053);
    			add_location(tr, file$d, 117, 16, 3709);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			if (if_block) if_block.m(tr, null);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(td2, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(td4, t9);
    			append_dev(tr, t10);
    			append_dev(tr, td5);
    			append_dev(td5, t11);
    			append_dev(tr, t12);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$leaderBoard*/ 4 && t2_value !== (t2_value = /*user*/ ctx[4].name + "")) set_data_dev(t2, t2_value);

    			if (/*$ratio*/ ctx[0] > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$7(ctx);
    					if_block.c();
    					if_block.m(tr, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$leaderBoard*/ 4 && t5_value !== (t5_value = /*user*/ ctx[4].wins + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*$leaderBoard*/ 4 && t7_value !== (t7_value = /*user*/ ctx[4].draws + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*$leaderBoard*/ 4 && t9_value !== (t9_value = /*user*/ ctx[4].losses + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*$leaderBoard*/ 4 && t11_value !== (t11_value = /*user*/ ctx[4].totalPoints + "")) set_data_dev(t11, t11_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(117:12) {#if user.name != $currUser.name}",
    		ctx
    	});

    	return block;
    }

    // (133:20) {#if $ratio > 1}
    function create_if_block_2$7(ctx) {
    	let th;
    	let t_value = /*user*/ ctx[4].gamesPlayed + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "svelte-hrke3z");
    			add_location(th, file$d, 133, 24, 4283);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$leaderBoard*/ 4 && t_value !== (t_value = /*user*/ ctx[4].gamesPlayed + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(133:20) {#if $ratio > 1}",
    		ctx
    	});

    	return block;
    }

    // (121:20) {#if $ratio > 1}
    function create_if_block_1$7(ctx) {
    	let td;
    	let t_value = /*user*/ ctx[4].gamesPlayed + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-hrke3z");
    			add_location(td, file$d, 121, 24, 3853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$leaderBoard*/ 4 && t_value !== (t_value = /*user*/ ctx[4].gamesPlayed + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(121:20) {#if $ratio > 1}",
    		ctx
    	});

    	return block;
    }

    // (116:8) {#each $leaderBoard as user, i}
    function create_each_block$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*user*/ ctx[4].name != /*$currUser*/ ctx[1].name) return create_if_block$a;
    		return create_else_block$8;
    	}

    	let current_block_type = select_block_type(ctx);
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
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(116:8) {#each $leaderBoard as user, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div0;
    	let t0;
    	let h50;
    	let t2;
    	let hr0;
    	let t3;
    	let table0;
    	let tr0;
    	let th0;
    	let t5;
    	let td0;
    	let t6_value = /*$currUser*/ ctx[1].position + "";
    	let t6;
    	let t7;
    	let tr1;
    	let th1;
    	let t9;
    	let td1;
    	let t10_value = /*$currUser*/ ctx[1].totalPoints + "";
    	let t10;
    	let t11;
    	let tr2;
    	let th2;
    	let t13;
    	let td2;
    	let t14_value = /*$currUser*/ ctx[1].wins + "";
    	let t14;
    	let t15;
    	let tr3;
    	let th3;
    	let t17;
    	let td3;
    	let t18_value = /*$currUser*/ ctx[1].draws + "";
    	let t18;
    	let t19;
    	let tr4;
    	let th4;
    	let t21;
    	let td4;
    	let t22_value = /*$currUser*/ ctx[1].losses + "";
    	let t22;
    	let t23;
    	let tr5;
    	let th5;
    	let t25;
    	let td5;
    	let t26_value = /*$currUser*/ ctx[1].gamesPlayed + "";
    	let t26;
    	let t27;
    	let tr6;
    	let th6;
    	let t29;
    	let td6;
    	let t30_value = /*$currUser*/ ctx[1].gamesPlayed + "";
    	let t30;
    	let t31;
    	let tr7;
    	let th7;
    	let t33;
    	let td7;
    	let t34_value = /*$currUser*/ ctx[1].avgMovesPerGame + "";
    	let t34;
    	let t35;
    	let tr8;
    	let th8;
    	let t37;
    	let td8;
    	let t38_value = /*$currUser*/ ctx[1].mostMoves + "";
    	let t38;
    	let t39;
    	let tr9;
    	let th9;
    	let t41;
    	let td9;
    	let t42_value = /*$currUser*/ ctx[1].leastMoves + "";
    	let t42;
    	let t43;
    	let tr10;
    	let th10;
    	let t45;
    	let td10;
    	let t46_value = /*$currUser*/ ctx[1].totalTimePlayed + "";
    	let t46;
    	let t47;
    	let t48;
    	let tr11;
    	let th11;
    	let t50;
    	let td11;
    	let t51_value = /*$currUser*/ ctx[1].avgTimePlayPerGame + "";
    	let t51;
    	let t52;
    	let t53;
    	let tr12;
    	let th12;
    	let t55;
    	let td12;
    	let t56_value = /*$currUser*/ ctx[1].leastTimePlayed + "";
    	let t56;
    	let t57;
    	let t58;
    	let tr13;
    	let th13;
    	let t60;
    	let td13;
    	let t61_value = /*$currUser*/ ctx[1].mostTimePlayed + "";
    	let t61;
    	let t62;
    	let t63;
    	let div1;
    	let t64;
    	let h51;
    	let t66;
    	let hr1;
    	let t67;
    	let h6;
    	let t68;
    	let t69_value = /*$currUser*/ ctx[1].position + "";
    	let t69;
    	let t70;
    	let table1;
    	let tr14;
    	let th14;
    	let t72;
    	let th15;
    	let t74;
    	let t75;
    	let th16;
    	let t77;
    	let th17;
    	let t79;
    	let th18;
    	let t81;
    	let th19;
    	let t83;
    	let if_block0 = /*$ratio*/ ctx[0] < 1 && create_if_block_5$3(ctx);
    	let if_block1 = /*$ratio*/ ctx[0] < 1 && create_if_block_4$3(ctx);
    	let if_block2 = /*$ratio*/ ctx[0] > 1 && create_if_block_3$3(ctx);
    	let each_value = /*$leaderBoard*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			h50 = element("h5");
    			h50.textContent = "My Stats";
    			t2 = space();
    			hr0 = element("hr");
    			t3 = space();
    			table0 = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "League Position";
    			t5 = space();
    			td0 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			tr1 = element("tr");
    			th1 = element("th");
    			th1.textContent = "Total Points";
    			t9 = space();
    			td1 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			tr2 = element("tr");
    			th2 = element("th");
    			th2.textContent = "Wins";
    			t13 = space();
    			td2 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			tr3 = element("tr");
    			th3 = element("th");
    			th3.textContent = "Draws";
    			t17 = space();
    			td3 = element("td");
    			t18 = text(t18_value);
    			t19 = space();
    			tr4 = element("tr");
    			th4 = element("th");
    			th4.textContent = "Losses";
    			t21 = space();
    			td4 = element("td");
    			t22 = text(t22_value);
    			t23 = space();
    			tr5 = element("tr");
    			th5 = element("th");
    			th5.textContent = "Games Played";
    			t25 = space();
    			td5 = element("td");
    			t26 = text(t26_value);
    			t27 = space();
    			tr6 = element("tr");
    			th6 = element("th");
    			th6.textContent = "Total Moves";
    			t29 = space();
    			td6 = element("td");
    			t30 = text(t30_value);
    			t31 = space();
    			tr7 = element("tr");
    			th7 = element("th");
    			th7.textContent = "Avg. Moves Per Game";
    			t33 = space();
    			td7 = element("td");
    			t34 = text(t34_value);
    			t35 = space();
    			tr8 = element("tr");
    			th8 = element("th");
    			th8.textContent = "Most Moves";
    			t37 = space();
    			td8 = element("td");
    			t38 = text(t38_value);
    			t39 = space();
    			tr9 = element("tr");
    			th9 = element("th");
    			th9.textContent = "Least Moves";
    			t41 = space();
    			td9 = element("td");
    			t42 = text(t42_value);
    			t43 = space();
    			tr10 = element("tr");
    			th10 = element("th");
    			th10.textContent = "Total Time Played";
    			t45 = space();
    			td10 = element("td");
    			t46 = text(t46_value);
    			t47 = text(" minutes");
    			t48 = space();
    			tr11 = element("tr");
    			th11 = element("th");
    			th11.textContent = "Avg. Time Played Per Game";
    			t50 = space();
    			td11 = element("td");
    			t51 = text(t51_value);
    			t52 = text(" minutes");
    			t53 = space();
    			tr12 = element("tr");
    			th12 = element("th");
    			th12.textContent = "Least Time Played";
    			t55 = space();
    			td12 = element("td");
    			t56 = text(t56_value);
    			t57 = text(" minutes");
    			t58 = space();
    			tr13 = element("tr");
    			th13 = element("th");
    			th13.textContent = "Most Time Played";
    			t60 = space();
    			td13 = element("td");
    			t61 = text(t61_value);
    			t62 = text(" minutes");
    			t63 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t64 = space();
    			h51 = element("h5");
    			h51.textContent = "Checkas League - Top 50";
    			t66 = space();
    			hr1 = element("hr");
    			t67 = space();
    			h6 = element("h6");
    			t68 = text("League Position - #");
    			t69 = text(t69_value);
    			t70 = space();
    			table1 = element("table");
    			tr14 = element("tr");
    			th14 = element("th");
    			th14.textContent = "#";
    			t72 = space();
    			th15 = element("th");
    			th15.textContent = "Name";
    			t74 = space();
    			if (if_block2) if_block2.c();
    			t75 = space();
    			th16 = element("th");
    			th16.textContent = "Wins";
    			t77 = space();
    			th17 = element("th");
    			th17.textContent = "Draws";
    			t79 = space();
    			th18 = element("th");
    			th18.textContent = "Losses";
    			t81 = space();
    			th19 = element("th");
    			th19.textContent = "Points";
    			t83 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h50, "id", "titleStats");
    			attr_dev(h50, "class", "svelte-hrke3z");
    			add_location(h50, file$d, 29, 4, 953);
    			add_location(hr0, file$d, 30, 4, 991);
    			set_style(th0, "text-align", "left");
    			attr_dev(th0, "class", "svelte-hrke3z");
    			add_location(th0, file$d, 34, 12, 1051);
    			attr_dev(td0, "class", "svelte-hrke3z");
    			add_location(td0, file$d, 35, 12, 1113);
    			add_location(tr0, file$d, 33, 8, 1034);
    			set_style(th1, "text-align", "left");
    			attr_dev(th1, "class", "svelte-hrke3z");
    			add_location(th1, file$d, 38, 12, 1182);
    			attr_dev(td1, "class", "svelte-hrke3z");
    			add_location(td1, file$d, 39, 12, 1241);
    			add_location(tr1, file$d, 37, 8, 1165);
    			set_style(th2, "text-align", "left");
    			attr_dev(th2, "class", "svelte-hrke3z");
    			add_location(th2, file$d, 42, 12, 1313);
    			attr_dev(td2, "class", "svelte-hrke3z");
    			add_location(td2, file$d, 43, 12, 1364);
    			add_location(tr2, file$d, 41, 8, 1296);
    			set_style(th3, "text-align", "left");
    			attr_dev(th3, "class", "svelte-hrke3z");
    			add_location(th3, file$d, 46, 12, 1429);
    			attr_dev(td3, "class", "svelte-hrke3z");
    			add_location(td3, file$d, 47, 12, 1481);
    			add_location(tr3, file$d, 45, 8, 1412);
    			set_style(th4, "text-align", "left");
    			attr_dev(th4, "class", "svelte-hrke3z");
    			add_location(th4, file$d, 50, 12, 1547);
    			attr_dev(td4, "class", "svelte-hrke3z");
    			add_location(td4, file$d, 51, 12, 1600);
    			add_location(tr4, file$d, 49, 8, 1530);
    			set_style(th5, "text-align", "left");
    			attr_dev(th5, "class", "svelte-hrke3z");
    			add_location(th5, file$d, 54, 12, 1667);
    			attr_dev(td5, "class", "svelte-hrke3z");
    			add_location(td5, file$d, 55, 12, 1726);
    			add_location(tr5, file$d, 53, 8, 1650);
    			set_style(th6, "text-align", "left");
    			attr_dev(th6, "class", "svelte-hrke3z");
    			add_location(th6, file$d, 58, 12, 1798);
    			attr_dev(td6, "class", "svelte-hrke3z");
    			add_location(td6, file$d, 59, 12, 1856);
    			add_location(tr6, file$d, 57, 8, 1781);
    			set_style(th7, "text-align", "left");
    			attr_dev(th7, "class", "svelte-hrke3z");
    			add_location(th7, file$d, 62, 12, 1928);
    			attr_dev(td7, "class", "svelte-hrke3z");
    			add_location(td7, file$d, 63, 12, 1994);
    			add_location(tr7, file$d, 61, 8, 1911);
    			set_style(th8, "text-align", "left");
    			attr_dev(th8, "class", "svelte-hrke3z");
    			add_location(th8, file$d, 66, 12, 2070);
    			attr_dev(td8, "class", "svelte-hrke3z");
    			add_location(td8, file$d, 67, 12, 2127);
    			add_location(tr8, file$d, 65, 8, 2053);
    			set_style(th9, "text-align", "left");
    			attr_dev(th9, "class", "svelte-hrke3z");
    			add_location(th9, file$d, 70, 12, 2197);
    			attr_dev(td9, "class", "svelte-hrke3z");
    			add_location(td9, file$d, 71, 12, 2255);
    			add_location(tr9, file$d, 69, 8, 2180);
    			set_style(th10, "text-align", "left");
    			attr_dev(th10, "class", "svelte-hrke3z");
    			add_location(th10, file$d, 74, 12, 2326);
    			attr_dev(td10, "class", "svelte-hrke3z");
    			add_location(td10, file$d, 75, 12, 2390);
    			add_location(tr10, file$d, 73, 8, 2309);
    			set_style(th11, "text-align", "left");
    			attr_dev(th11, "class", "svelte-hrke3z");
    			add_location(th11, file$d, 78, 12, 2474);
    			attr_dev(td11, "class", "svelte-hrke3z");
    			add_location(td11, file$d, 79, 12, 2546);
    			add_location(tr11, file$d, 77, 8, 2457);
    			set_style(th12, "text-align", "left");
    			attr_dev(th12, "class", "svelte-hrke3z");
    			add_location(th12, file$d, 82, 12, 2633);
    			attr_dev(td12, "class", "svelte-hrke3z");
    			add_location(td12, file$d, 83, 12, 2697);
    			add_location(tr12, file$d, 81, 8, 2616);
    			set_style(th13, "text-align", "left");
    			attr_dev(th13, "class", "svelte-hrke3z");
    			add_location(th13, file$d, 86, 12, 2781);
    			attr_dev(td13, "class", "svelte-hrke3z");
    			add_location(td13, file$d, 87, 12, 2844);
    			add_location(tr13, file$d, 85, 8, 2764);
    			attr_dev(table0, "id", "statsTable");
    			attr_dev(table0, "class", "svelte-hrke3z");
    			add_location(table0, file$d, 32, 4, 1002);
    			attr_dev(div0, "id", "stats");
    			attr_dev(div0, "class", "container-fluid svelte-hrke3z");
    			add_location(div0, file$d, 23, 0, 722);
    			attr_dev(h51, "id", "titleLeague");
    			attr_dev(h51, "class", "svelte-hrke3z");
    			add_location(h51, file$d, 98, 4, 3155);
    			add_location(hr1, file$d, 99, 4, 3209);
    			set_style(h6, "text-align", "center");
    			set_style(h6, "margin-top", "10px");
    			set_style(h6, "margin-bottom", "10px");
    			add_location(h6, file$d, 101, 4, 3220);
    			attr_dev(th14, "class", "svelte-hrke3z");
    			add_location(th14, file$d, 105, 12, 3369);
    			attr_dev(th15, "class", "svelte-hrke3z");
    			add_location(th15, file$d, 106, 12, 3392);
    			attr_dev(th16, "class", "svelte-hrke3z");
    			add_location(th16, file$d, 110, 12, 3496);
    			attr_dev(th17, "class", "svelte-hrke3z");
    			add_location(th17, file$d, 111, 12, 3522);
    			attr_dev(th18, "class", "svelte-hrke3z");
    			add_location(th18, file$d, 112, 12, 3549);
    			attr_dev(th19, "class", "svelte-hrke3z");
    			add_location(th19, file$d, 113, 12, 3577);
    			add_location(tr14, file$d, 104, 8, 3352);
    			attr_dev(table1, "class", "svelte-hrke3z");
    			add_location(table1, file$d, 103, 4, 3336);
    			attr_dev(div1, "id", "league");
    			attr_dev(div1, "class", "container-fluid svelte-hrke3z");
    			add_location(div1, file$d, 92, 0, 2923);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, h50);
    			append_dev(div0, t2);
    			append_dev(div0, hr0);
    			append_dev(div0, t3);
    			append_dev(div0, table0);
    			append_dev(table0, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t5);
    			append_dev(tr0, td0);
    			append_dev(td0, t6);
    			append_dev(table0, t7);
    			append_dev(table0, tr1);
    			append_dev(tr1, th1);
    			append_dev(tr1, t9);
    			append_dev(tr1, td1);
    			append_dev(td1, t10);
    			append_dev(table0, t11);
    			append_dev(table0, tr2);
    			append_dev(tr2, th2);
    			append_dev(tr2, t13);
    			append_dev(tr2, td2);
    			append_dev(td2, t14);
    			append_dev(table0, t15);
    			append_dev(table0, tr3);
    			append_dev(tr3, th3);
    			append_dev(tr3, t17);
    			append_dev(tr3, td3);
    			append_dev(td3, t18);
    			append_dev(table0, t19);
    			append_dev(table0, tr4);
    			append_dev(tr4, th4);
    			append_dev(tr4, t21);
    			append_dev(tr4, td4);
    			append_dev(td4, t22);
    			append_dev(table0, t23);
    			append_dev(table0, tr5);
    			append_dev(tr5, th5);
    			append_dev(tr5, t25);
    			append_dev(tr5, td5);
    			append_dev(td5, t26);
    			append_dev(table0, t27);
    			append_dev(table0, tr6);
    			append_dev(tr6, th6);
    			append_dev(tr6, t29);
    			append_dev(tr6, td6);
    			append_dev(td6, t30);
    			append_dev(table0, t31);
    			append_dev(table0, tr7);
    			append_dev(tr7, th7);
    			append_dev(tr7, t33);
    			append_dev(tr7, td7);
    			append_dev(td7, t34);
    			append_dev(table0, t35);
    			append_dev(table0, tr8);
    			append_dev(tr8, th8);
    			append_dev(tr8, t37);
    			append_dev(tr8, td8);
    			append_dev(td8, t38);
    			append_dev(table0, t39);
    			append_dev(table0, tr9);
    			append_dev(tr9, th9);
    			append_dev(tr9, t41);
    			append_dev(tr9, td9);
    			append_dev(td9, t42);
    			append_dev(table0, t43);
    			append_dev(table0, tr10);
    			append_dev(tr10, th10);
    			append_dev(tr10, t45);
    			append_dev(tr10, td10);
    			append_dev(td10, t46);
    			append_dev(td10, t47);
    			append_dev(table0, t48);
    			append_dev(table0, tr11);
    			append_dev(tr11, th11);
    			append_dev(tr11, t50);
    			append_dev(tr11, td11);
    			append_dev(td11, t51);
    			append_dev(td11, t52);
    			append_dev(table0, t53);
    			append_dev(table0, tr12);
    			append_dev(tr12, th12);
    			append_dev(tr12, t55);
    			append_dev(tr12, td12);
    			append_dev(td12, t56);
    			append_dev(td12, t57);
    			append_dev(table0, t58);
    			append_dev(table0, tr13);
    			append_dev(tr13, th13);
    			append_dev(tr13, t60);
    			append_dev(tr13, td13);
    			append_dev(td13, t61);
    			append_dev(td13, t62);
    			insert_dev(target, t63, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t64);
    			append_dev(div1, h51);
    			append_dev(div1, t66);
    			append_dev(div1, hr1);
    			append_dev(div1, t67);
    			append_dev(div1, h6);
    			append_dev(h6, t68);
    			append_dev(h6, t69);
    			append_dev(div1, t70);
    			append_dev(div1, table1);
    			append_dev(table1, tr14);
    			append_dev(tr14, th14);
    			append_dev(tr14, t72);
    			append_dev(tr14, th15);
    			append_dev(tr14, t74);
    			if (if_block2) if_block2.m(tr14, null);
    			append_dev(tr14, t75);
    			append_dev(tr14, th16);
    			append_dev(tr14, t77);
    			append_dev(tr14, th17);
    			append_dev(tr14, t79);
    			append_dev(tr14, th18);
    			append_dev(tr14, t81);
    			append_dev(tr14, th19);
    			append_dev(table1, t83);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$ratio*/ ctx[0] < 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$3(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*$currUser*/ 2 && t6_value !== (t6_value = /*$currUser*/ ctx[1].position + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$currUser*/ 2 && t10_value !== (t10_value = /*$currUser*/ ctx[1].totalPoints + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*$currUser*/ 2 && t14_value !== (t14_value = /*$currUser*/ ctx[1].wins + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*$currUser*/ 2 && t18_value !== (t18_value = /*$currUser*/ ctx[1].draws + "")) set_data_dev(t18, t18_value);
    			if (dirty & /*$currUser*/ 2 && t22_value !== (t22_value = /*$currUser*/ ctx[1].losses + "")) set_data_dev(t22, t22_value);
    			if (dirty & /*$currUser*/ 2 && t26_value !== (t26_value = /*$currUser*/ ctx[1].gamesPlayed + "")) set_data_dev(t26, t26_value);
    			if (dirty & /*$currUser*/ 2 && t30_value !== (t30_value = /*$currUser*/ ctx[1].gamesPlayed + "")) set_data_dev(t30, t30_value);
    			if (dirty & /*$currUser*/ 2 && t34_value !== (t34_value = /*$currUser*/ ctx[1].avgMovesPerGame + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*$currUser*/ 2 && t38_value !== (t38_value = /*$currUser*/ ctx[1].mostMoves + "")) set_data_dev(t38, t38_value);
    			if (dirty & /*$currUser*/ 2 && t42_value !== (t42_value = /*$currUser*/ ctx[1].leastMoves + "")) set_data_dev(t42, t42_value);
    			if (dirty & /*$currUser*/ 2 && t46_value !== (t46_value = /*$currUser*/ ctx[1].totalTimePlayed + "")) set_data_dev(t46, t46_value);
    			if (dirty & /*$currUser*/ 2 && t51_value !== (t51_value = /*$currUser*/ ctx[1].avgTimePlayPerGame + "")) set_data_dev(t51, t51_value);
    			if (dirty & /*$currUser*/ 2 && t56_value !== (t56_value = /*$currUser*/ ctx[1].leastTimePlayed + "")) set_data_dev(t56, t56_value);
    			if (dirty & /*$currUser*/ 2 && t61_value !== (t61_value = /*$currUser*/ ctx[1].mostTimePlayed + "")) set_data_dev(t61, t61_value);

    			if (/*$ratio*/ ctx[0] < 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$3(ctx);
    					if_block1.c();
    					if_block1.m(div1, t64);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*$currUser*/ 2 && t69_value !== (t69_value = /*$currUser*/ ctx[1].position + "")) set_data_dev(t69, t69_value);

    			if (/*$ratio*/ ctx[0] > 1) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_3$3(ctx);
    					if_block2.c();
    					if_block2.m(tr14, t75);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*$leaderBoard, $ratio, $currUser*/ 7) {
    				each_value = /*$leaderBoard*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table1, null);
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
    			if (detaching) detach_dev(div0);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t63);
    			if (detaching) detach_dev(div1);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function viewMyStats() {
    	let myStats = document.getElementById("stats");
    	let league = document.getElementById("league");
    	league.setAttribute("style", "left:-100%");
    	myStats.setAttribute("style", "left:0");
    }

    function viewLeagueTable() {
    	let myStats = document.getElementById("stats");
    	let league = document.getElementById("league");
    	league.setAttribute("style", "left:0");
    	myStats.setAttribute("style", "left:100%");
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $ratio;
    	let $currUser;
    	let $leaderBoard;
    	validate_store(ratio, "ratio");
    	component_subscribe($$self, ratio, $$value => $$invalidate(0, $ratio = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(1, $currUser = $$value));
    	validate_store(leaderBoard, "leaderBoard");
    	component_subscribe($$self, leaderBoard, $$value => $$invalidate(2, $leaderBoard = $$value));
    	let screenWidth = screen.width;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LeaderBoard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LeaderBoard", $$slots, []);

    	$$self.$capture_state = () => ({
    		currUser,
    		page,
    		userGames,
    		leaderBoard,
    		currSocket,
    		ratio,
    		getLeagueTable,
    		screenWidth,
    		viewMyStats,
    		viewLeagueTable,
    		$ratio,
    		$currUser,
    		$leaderBoard
    	});

    	$$self.$inject_state = $$props => {
    		if ("screenWidth" in $$props) screenWidth = $$props.screenWidth;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$ratio, $currUser, $leaderBoard];
    }

    class LeaderBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LeaderBoard",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/Components/sideBar.svelte generated by Svelte v3.22.3 */
    const file$e = "src/Components/sideBar.svelte";

    // (150:20) 
    function create_if_block_4$4(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let t3;
    	let div1_transition;
    	let current;
    	let dispose;
    	const blur = new BlurScreen({ $$inline: true });
    	let if_block0 = /*screenWidth*/ ctx[9] < 800 && create_if_block_8$2(ctx);
    	let if_block1 = /*$viewGameList*/ ctx[8] && create_if_block_7$2(ctx);
    	let if_block2 = /*settingsView*/ ctx[0] && create_if_block_6$2(ctx);
    	let if_block3 = /*leaderBoardView*/ ctx[1] && create_if_block_5$4(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(blur.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			add_location(div0, file$e, 150, 4, 4120);
    			attr_dev(div1, "id", "bigPopUp");
    			attr_dev(div1, "class", "container-fluid svelte-1p2uqq2");
    			add_location(div1, file$e, 153, 4, 4179);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			mount_component(blur, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block3) if_block3.m(div1, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(div0, "click", /*closeNav*/ ctx[10], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (/*screenWidth*/ ctx[9] < 800) if_block0.p(ctx, dirty);

    			if (/*$viewGameList*/ ctx[8]) {
    				if (if_block1) {
    					if (dirty & /*$viewGameList*/ 256) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*settingsView*/ ctx[0]) {
    				if (if_block2) {
    					if (dirty & /*settingsView*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_6$2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, t3);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*leaderBoardView*/ ctx[1]) {
    				if (if_block3) {
    					if (dirty & /*leaderBoardView*/ 2) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_5$4(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div1, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blur.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: -200, duration: 1000 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blur.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: -200, duration: 1000 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(blur);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (detaching && div1_transition) div1_transition.end();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$4.name,
    		type: "if",
    		source: "(150:20) ",
    		ctx
    	});

    	return block;
    }

    // (133:0) {#if $smallPopUp}
    function create_if_block$b(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let div1_transition;
    	let current;
    	let dispose;
    	const blur = new BlurScreen({ $$inline: true });
    	let if_block0 = /*screenWidth*/ ctx[9] < 800 && create_if_block_3$4(ctx);
    	let if_block1 = /*$viewCreateGame*/ ctx[5] && create_if_block_2$8(ctx);
    	let if_block2 = /*$viewJoinGame*/ ctx[6] && create_if_block_1$8(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(blur.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			add_location(div0, file$e, 133, 4, 3680);
    			attr_dev(div1, "id", "smallPopUp");
    			attr_dev(div1, "class", "container-fluid svelte-1p2uqq2");
    			add_location(div1, file$e, 136, 4, 3739);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			mount_component(blur, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(div0, "click", /*closeNav*/ ctx[10], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (/*screenWidth*/ ctx[9] < 800) if_block0.p(ctx, dirty);

    			if (/*$viewCreateGame*/ ctx[5]) {
    				if (if_block1) {
    					if (dirty & /*$viewCreateGame*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$8(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$viewJoinGame*/ ctx[6]) {
    				if (if_block2) {
    					if (dirty & /*$viewJoinGame*/ 64) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$8(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blur.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: -200, duration: 1000 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blur.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: -200, duration: 1000 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(blur);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching && div1_transition) div1_transition.end();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(133:0) {#if $smallPopUp}",
    		ctx
    	});

    	return block;
    }

    // (155:8) {#if screenWidth < 800}
    function create_if_block_8$2(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Close";
    			attr_dev(button, "class", "btn btn-danger svelte-1p2uqq2");
    			add_location(button, file$e, 155, 12, 4310);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*closeNav*/ ctx[10], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(155:8) {#if screenWidth < 800}",
    		ctx
    	});

    	return block;
    }

    // (159:8) {#if $viewGameList}
    function create_if_block_7$2(ctx) {
    	let current;
    	const list = new GameList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(list.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(list, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(list.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(list.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(list, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(159:8) {#if $viewGameList}",
    		ctx
    	});

    	return block;
    }

    // (163:8) {#if settingsView}
    function create_if_block_6$2(ctx) {
    	let current;
    	const settings = new Settings({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(settings.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(settings, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(settings, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(163:8) {#if settingsView}",
    		ctx
    	});

    	return block;
    }

    // (167:8) {#if leaderBoardView}
    function create_if_block_5$4(ctx) {
    	let current;
    	const leaguetable = new LeaderBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(leaguetable.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(leaguetable, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leaguetable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leaguetable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(leaguetable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$4.name,
    		type: "if",
    		source: "(167:8) {#if leaderBoardView}",
    		ctx
    	});

    	return block;
    }

    // (138:8) {#if screenWidth < 800}
    function create_if_block_3$4(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Close";
    			attr_dev(button, "class", "btn btn-danger svelte-1p2uqq2");
    			add_location(button, file$e, 138, 12, 3872);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*closeNav*/ ctx[10], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(138:8) {#if screenWidth < 800}",
    		ctx
    	});

    	return block;
    }

    // (142:8) {#if $viewCreateGame}
    function create_if_block_2$8(ctx) {
    	let current;
    	const create = new GameCreate({ $$inline: true });

    	const block = {
    		c: function create$1() {
    			create_component(create.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(create, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(create.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(create.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(create, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$8.name,
    		type: "if",
    		source: "(142:8) {#if $viewCreateGame}",
    		ctx
    	});

    	return block;
    }

    // (146:8) {#if $viewJoinGame}
    function create_if_block_1$8(ctx) {
    	let current;
    	const join = new GameJoin({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(join.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(join, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(join.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(join.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(join, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(146:8) {#if $viewJoinGame}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div7;
    	let div0;
    	let button0;
    	let img;
    	let img_src_value;
    	let t0;
    	let i0;
    	let t1;
    	let div1;
    	let button1;
    	let t2;
    	let i1;
    	let button1_disabled_value;
    	let t3;
    	let div2;
    	let button2;
    	let t4;
    	let i2;
    	let button2_disabled_value;
    	let t5;
    	let div3;
    	let button3;
    	let t6;
    	let i3;
    	let t7;
    	let div4;
    	let button4;
    	let t8;
    	let i4;
    	let t9;
    	let div5;
    	let button5;
    	let t10;
    	let i5;
    	let t11;
    	let div6;
    	let button6;
    	let t12;
    	let t13_value = /*$currUser*/ ctx[2].name + "";
    	let t13;
    	let t14;
    	let i6;
    	let t15;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block$b, create_if_block_4$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$smallPopUp*/ ctx[4]) return 0;
    		if (/*$bigPopUp*/ ctx[7]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			img = element("img");
    			t0 = text(" Checkas.io ");
    			i0 = element("i");
    			t1 = space();
    			div1 = element("div");
    			button1 = element("button");
    			t2 = text("Create Game ");
    			i1 = element("i");
    			t3 = space();
    			div2 = element("div");
    			button2 = element("button");
    			t4 = text("Join Game ");
    			i2 = element("i");
    			t5 = space();
    			div3 = element("div");
    			button3 = element("button");
    			t6 = text("View Games ");
    			i3 = element("i");
    			t7 = space();
    			div4 = element("div");
    			button4 = element("button");
    			t8 = text("Leadership Board ");
    			i4 = element("i");
    			t9 = space();
    			div5 = element("div");
    			button5 = element("button");
    			t10 = text("Settings ");
    			i5 = element("i");
    			t11 = space();
    			div6 = element("div");
    			button6 = element("button");
    			t12 = text("Logout (");
    			t13 = text(t13_value);
    			t14 = text(") ");
    			i6 = element("i");
    			t15 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(img, "alt", "logo");
    			if (img.src !== (img_src_value = "./images/LOGO-192.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1p2uqq2");
    			add_location(img, file$e, 104, 54, 2456);
    			attr_dev(i0, "class", "fa fa-angle-double-right svelte-1p2uqq2");
    			add_location(i0, file$e, 104, 111, 2513);
    			attr_dev(button0, "id", "home");
    			attr_dev(button0, "class", "btn btn-lg btn-dark svelte-1p2uqq2");
    			add_location(button0, file$e, 104, 8, 2410);
    			attr_dev(div0, "class", "menu-item svelte-1p2uqq2");
    			add_location(div0, file$e, 103, 4, 2378);
    			attr_dev(i1, "class", "fa fa-plus-square svelte-1p2uqq2");
    			add_location(i1, file$e, 108, 112, 2725);
    			attr_dev(button1, "class", "btn btn-lg btn-dark svelte-1p2uqq2");
    			button1.disabled = button1_disabled_value = /*$gamePref*/ ctx[3] != null;
    			add_location(button1, file$e, 108, 8, 2621);
    			attr_dev(div1, "class", "menu-item create svelte-1p2uqq2");
    			add_location(div1, file$e, 107, 4, 2582);
    			attr_dev(i2, "class", "fa fa-user-plus svelte-1p2uqq2");
    			add_location(i2, file$e, 112, 110, 2923);
    			attr_dev(button2, "class", "btn btn-lg btn-dark svelte-1p2uqq2");
    			button2.disabled = button2_disabled_value = /*$gamePref*/ ctx[3] != null;
    			add_location(button2, file$e, 112, 8, 2821);
    			attr_dev(div2, "class", "menu-item join svelte-1p2uqq2");
    			add_location(div2, file$e, 111, 4, 2784);
    			attr_dev(i3, "class", "fa fa-eye svelte-1p2uqq2");
    			add_location(i3, file$e, 116, 78, 3087);
    			attr_dev(button3, "class", "btn btn-lg btn-dark svelte-1p2uqq2");
    			add_location(button3, file$e, 116, 8, 3017);
    			attr_dev(div3, "class", "menu-item view svelte-1p2uqq2");
    			add_location(div3, file$e, 115, 4, 2980);
    			attr_dev(i4, "class", "fa fa-list-ol svelte-1p2uqq2");
    			add_location(i4, file$e, 120, 90, 3259);
    			attr_dev(button4, "class", "btn btn-lg btn-dark svelte-1p2uqq2");
    			add_location(button4, file$e, 120, 8, 3177);
    			attr_dev(div4, "class", "menu-item league svelte-1p2uqq2");
    			add_location(div4, file$e, 119, 4, 3138);
    			attr_dev(i5, "class", "fa fa-cog svelte-1p2uqq2");
    			add_location(i5, file$e, 124, 79, 3426);
    			attr_dev(button5, "class", "btn btn-lg btn-dark svelte-1p2uqq2");
    			add_location(button5, file$e, 124, 8, 3355);
    			attr_dev(div5, "class", "menu-item settings svelte-1p2uqq2");
    			add_location(div5, file$e, 123, 4, 3314);
    			attr_dev(i6, "class", "fa fa-sign-out svelte-1p2uqq2");
    			add_location(i6, file$e, 128, 91, 3599);
    			attr_dev(button6, "class", "btn btn-lg btn-dark svelte-1p2uqq2");
    			add_location(button6, file$e, 128, 8, 3516);
    			attr_dev(div6, "class", "menu-item logout svelte-1p2uqq2");
    			add_location(div6, file$e, 127, 4, 3477);
    			attr_dev(div7, "class", "sidebar svelte-1p2uqq2");
    			add_location(div7, file$e, 102, 0, 2352);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, button0);
    			append_dev(button0, img);
    			append_dev(button0, t0);
    			append_dev(button0, i0);
    			append_dev(div7, t1);
    			append_dev(div7, div1);
    			append_dev(div1, button1);
    			append_dev(button1, t2);
    			append_dev(button1, i1);
    			append_dev(div7, t3);
    			append_dev(div7, div2);
    			append_dev(div2, button2);
    			append_dev(button2, t4);
    			append_dev(button2, i2);
    			append_dev(div7, t5);
    			append_dev(div7, div3);
    			append_dev(div3, button3);
    			append_dev(button3, t6);
    			append_dev(button3, i3);
    			append_dev(div7, t7);
    			append_dev(div7, div4);
    			append_dev(div4, button4);
    			append_dev(button4, t8);
    			append_dev(button4, i4);
    			append_dev(div7, t9);
    			append_dev(div7, div5);
    			append_dev(div5, button5);
    			append_dev(button5, t10);
    			append_dev(button5, i5);
    			append_dev(div7, t11);
    			append_dev(div7, div6);
    			append_dev(div6, button6);
    			append_dev(button6, t12);
    			append_dev(button6, t13);
    			append_dev(button6, t14);
    			append_dev(button6, i6);
    			insert_dev(target, t15, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button1, "click", /*popGamePref*/ ctx[11], false, false, false),
    				listen_dev(button2, "click", /*popGamePass*/ ctx[12], false, false, false),
    				listen_dev(button3, "click", /*viewGames*/ ctx[13], false, false, false),
    				listen_dev(button4, "click", /*viewLeagueBoard*/ ctx[14], false, false, false),
    				listen_dev(button5, "click", /*viewSettings*/ ctx[15], false, false, false),
    				listen_dev(button6, "click", /*signOut*/ ctx[16], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$gamePref*/ 8 && button1_disabled_value !== (button1_disabled_value = /*$gamePref*/ ctx[3] != null)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (!current || dirty & /*$gamePref*/ 8 && button2_disabled_value !== (button2_disabled_value = /*$gamePref*/ ctx[3] != null)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if ((!current || dirty & /*$currUser*/ 4) && t13_value !== (t13_value = /*$currUser*/ ctx[2].name + "")) set_data_dev(t13, t13_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
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
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t15);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $leaderBoard;
    	let $currSocket;
    	let $currUser;
    	let $gamePref;
    	let $smallPopUp;
    	let $viewCreateGame;
    	let $viewJoinGame;
    	let $bigPopUp;
    	let $viewGameList;
    	validate_store(leaderBoard, "leaderBoard");
    	component_subscribe($$self, leaderBoard, $$value => $$invalidate(20, $leaderBoard = $$value));
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(21, $currSocket = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(2, $currUser = $$value));
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(3, $gamePref = $$value));
    	validate_store(smallPopUp, "smallPopUp");
    	component_subscribe($$self, smallPopUp, $$value => $$invalidate(4, $smallPopUp = $$value));
    	validate_store(viewCreateGame, "viewCreateGame");
    	component_subscribe($$self, viewCreateGame, $$value => $$invalidate(5, $viewCreateGame = $$value));
    	validate_store(viewJoinGame, "viewJoinGame");
    	component_subscribe($$self, viewJoinGame, $$value => $$invalidate(6, $viewJoinGame = $$value));
    	validate_store(bigPopUp, "bigPopUp");
    	component_subscribe($$self, bigPopUp, $$value => $$invalidate(7, $bigPopUp = $$value));
    	validate_store(viewGameList, "viewGameList");
    	component_subscribe($$self, viewGameList, $$value => $$invalidate(8, $viewGameList = $$value));
    	let screenWidth = screen.width;
    	let request;
    	let viewRightSlide = false, viewLeftSlide = false;
    	let settingsView = false;
    	let leaderBoardView = false, tutorialView = false;

    	function closeNav() {
    		(viewRightSlide = false, viewLeftSlide = false);
    		(viewGameList.set(false), $$invalidate(0, settingsView = false));
    		(smallPopUp.set(false), bigPopUp.set(false));
    		viewCreateGame.set(false);
    		viewJoinGame.set(false);
    		($$invalidate(1, leaderBoardView = false), tutorialView = false);
    	}

    	function popGamePref() {
    		closeNav();

    		setTimeout(
    			() => {
    				smallPopUp.set(true);
    			},
    			1
    		);

    		setTimeout(
    			() => {
    				viewCreateGame.set(true);
    			},
    			2
    		);

    		gameTab.set(0);
    	}

    	function popGamePass() {
    		closeNav();

    		setTimeout(
    			() => {
    				smallPopUp.set(true);
    			},
    			1
    		);

    		setTimeout(
    			() => {
    				viewJoinGame.set(true);
    			},
    			2
    		);

    		gameTab.set(0);
    	}

    	function viewGames() {
    		if ($leaderBoard.length > 0) {
    			closeNav();

    			setTimeout(
    				() => {
    					bigPopUp.set(true);
    				},
    				1
    			);

    			setTimeout(
    				() => {
    					viewGameList.set(true);
    				},
    				1
    			);

    			gameTab.set(1);
    		}
    	}

    	function viewLeagueBoard() {
    		if ($leaderBoard.length > 0) {
    			closeNav();

    			setTimeout(
    				() => {
    					bigPopUp.set(true);
    				},
    				1
    			);

    			setTimeout(
    				() => {
    					$$invalidate(1, leaderBoardView = true);
    				},
    				1
    			);

    			gameTab.set(2);
    		}
    	}

    	function viewSettings() {
    		closeNav();

    		setTimeout(
    			() => {
    				bigPopUp.set(true);
    			},
    			1
    		);

    		setTimeout(
    			() => {
    				$$invalidate(0, settingsView = true);
    			},
    			1
    		);

    		gameTab.set(4);
    	}

    	function signOut() {
    		$currSocket.emit("go-offline", $currUser.email);
    		currUser.set(null);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SideBar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SideBar", $$slots, []);

    	$$self.$capture_state = () => ({
    		currUser,
    		page,
    		userGames,
    		leaderBoard,
    		allChats,
    		gamePref,
    		currSocket,
    		viewCreateGame,
    		viewJoinGame,
    		viewGameList,
    		smallPopUp,
    		bigPopUp,
    		gameTab,
    		fly,
    		fade,
    		Create: GameCreate,
    		Join: GameJoin,
    		Blur: BlurScreen,
    		List: GameList,
    		Settings,
    		LeagueTable: LeaderBoard,
    		invokeFunction,
    		screenWidth,
    		request,
    		viewRightSlide,
    		viewLeftSlide,
    		settingsView,
    		leaderBoardView,
    		tutorialView,
    		closeNav,
    		popGamePref,
    		popGamePass,
    		viewGames,
    		viewLeagueBoard,
    		viewSettings,
    		signOut,
    		$leaderBoard,
    		$currSocket,
    		$currUser,
    		$gamePref,
    		$smallPopUp,
    		$viewCreateGame,
    		$viewJoinGame,
    		$bigPopUp,
    		$viewGameList
    	});

    	$$self.$inject_state = $$props => {
    		if ("screenWidth" in $$props) $$invalidate(9, screenWidth = $$props.screenWidth);
    		if ("request" in $$props) request = $$props.request;
    		if ("viewRightSlide" in $$props) viewRightSlide = $$props.viewRightSlide;
    		if ("viewLeftSlide" in $$props) viewLeftSlide = $$props.viewLeftSlide;
    		if ("settingsView" in $$props) $$invalidate(0, settingsView = $$props.settingsView);
    		if ("leaderBoardView" in $$props) $$invalidate(1, leaderBoardView = $$props.leaderBoardView);
    		if ("tutorialView" in $$props) tutorialView = $$props.tutorialView;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settingsView,
    		leaderBoardView,
    		$currUser,
    		$gamePref,
    		$smallPopUp,
    		$viewCreateGame,
    		$viewJoinGame,
    		$bigPopUp,
    		$viewGameList,
    		screenWidth,
    		closeNav,
    		popGamePref,
    		popGamePass,
    		viewGames,
    		viewLeagueBoard,
    		viewSettings,
    		signOut
    	];
    }

    class SideBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBar",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    class User {

        constructor(data) {
            this.isAuth = true;
            
            this.name = data.name;
            this.email = data.email;
            this.picture = data.picture == null ? 'https://api.adorable.io/avatars/285/' + data.email + '.png' : data.picture;
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
            this.position = null;

            this.gamePref = {
                myColor: data.gamePreferences.myColor,
                otherColor: data.gamePreferences.otherColor,
                compTime: data.gamePreferences.compTime,
                orient: data.gamePreferences.orient
            };
        }
    }

    /* src/Pages/entry.svelte generated by Svelte v3.22.3 */

    const { console: console_1$7 } = globals;
    const file$f = "src/Pages/entry.svelte";

    // (215:4) {#if viewError}
    function create_if_block_6$3(ctx) {
    	let h6;
    	let t;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			t = text(/*errMsg*/ ctx[9]);
    			set_style(h6, "text-align", "center");
    			set_style(h6, "color", "red");
    			set_style(h6, "margin-top", "20px");
    			attr_dev(h6, "class", "svelte-1h77a0u");
    			add_location(h6, file$f, 215, 8, 6482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*errMsg*/ 512) set_data_dev(t, /*errMsg*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$3.name,
    		type: "if",
    		source: "(215:4) {#if viewError}",
    		ctx
    	});

    	return block;
    }

    // (250:30) 
    function create_if_block_4$5(ctx) {
    	let div;
    	let input;
    	let t0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let br;
    	let a;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block_5$5, create_else_block_2$3];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (!/*loading*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_3(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			br = element("br");
    			a = element("a");
    			a.textContent = "Back To Login";
    			attr_dev(input, "id", "Email");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Email");
    			input.required = true;
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "class", "svelte-1h77a0u");
    			add_location(input, file$f, 251, 12, 8658);
    			attr_dev(br, "class", "svelte-1h77a0u");
    			add_location(br, file$f, 257, 12, 9012);
    			attr_dev(a, "id", "forgotPassword");
    			attr_dev(a, "class", "svelte-1h77a0u");
    			add_location(a, file$f, 257, 17, 9017);
    			attr_dev(div, "id", "signup-div");
    			attr_dev(div, "class", "svelte-1h77a0u");
    			add_location(div, file$f, 250, 8, 8624);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*logEmail*/ ctx[4]);
    			append_dev(div, t0);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, a);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[30]),
    				listen_dev(a, "click", /*click_handler_3*/ ctx[31], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*logEmail*/ 16 && input.value !== /*logEmail*/ ctx[4]) {
    				set_input_value(input, /*logEmail*/ ctx[4]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_3(ctx);

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
    				if_block.m(div, t1);
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
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$5.name,
    		type: "if",
    		source: "(250:30) ",
    		ctx
    	});

    	return block;
    }

    // (234:31) 
    function create_if_block_2$9(ctx) {
    	let div0;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let input3;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let hr;
    	let t5;
    	let div1;
    	let h5;
    	let t6;
    	let br;
    	let button;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block_3$5, create_else_block_1$5];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (!/*loading*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			input3 = element("input");
    			t3 = space();
    			if_block.c();
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t6 = text("Already have an Account? ");
    			br = element("br");
    			button = element("button");
    			button.textContent = "Sign In";
    			attr_dev(input0, "id", "Name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Display Name");
    			input0.required = true;
    			attr_dev(input0, "autocomplete", "off");
    			attr_dev(input0, "class", "svelte-1h77a0u");
    			add_location(input0, file$f, 235, 12, 7592);
    			attr_dev(input1, "id", "Email");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Email");
    			input1.required = true;
    			attr_dev(input1, "autocomplete", "off");
    			attr_dev(input1, "class", "svelte-1h77a0u");
    			add_location(input1, file$f, 236, 12, 7710);
    			attr_dev(input2, "id", "Password");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "placeholder", "Password");
    			input2.required = true;
    			attr_dev(input2, "class", "svelte-1h77a0u");
    			add_location(input2, file$f, 237, 12, 7823);
    			attr_dev(input3, "id", "confirmPassword");
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "placeholder", "Confirm Password");
    			input3.required = true;
    			attr_dev(input3, "class", "svelte-1h77a0u");
    			add_location(input3, file$f, 238, 12, 7930);
    			attr_dev(div0, "id", "signup-div");
    			attr_dev(div0, "class", "svelte-1h77a0u");
    			add_location(div0, file$f, 234, 8, 7558);
    			set_style(hr, "border", "1px solid green");
    			attr_dev(hr, "class", "svelte-1h77a0u");
    			add_location(hr, file$f, 245, 8, 8352);
    			attr_dev(br, "class", "svelte-1h77a0u");
    			add_location(br, file$f, 247, 41, 8473);
    			attr_dev(button, "class", "login-signup svelte-1h77a0u");
    			add_location(button, file$f, 247, 46, 8478);
    			attr_dev(h5, "class", "svelte-1h77a0u");
    			add_location(h5, file$f, 247, 12, 8444);
    			attr_dev(div1, "class", "no-cred-sign-signup svelte-1h77a0u");
    			add_location(div1, file$f, 246, 8, 8398);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input0);
    			set_input_value(input0, /*Name*/ ctx[1]);
    			append_dev(div0, t0);
    			append_dev(div0, input1);
    			set_input_value(input1, /*Email*/ ctx[0]);
    			append_dev(div0, t1);
    			append_dev(div0, input2);
    			set_input_value(input2, /*Password*/ ctx[2]);
    			append_dev(div0, t2);
    			append_dev(div0, input3);
    			set_input_value(input3, /*confirmPassword*/ ctx[3]);
    			append_dev(div0, t3);
    			if_blocks[current_block_type_index].m(div0, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h5);
    			append_dev(h5, t6);
    			append_dev(h5, br);
    			append_dev(h5, button);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[24]),
    				listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[25]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[26]),
    				listen_dev(input3, "input", /*input3_input_handler*/ ctx[27]),
    				listen_dev(input3, "keyup", /*checkPasswordMatch*/ ctx[11], false, false, false),
    				listen_dev(input3, "keydown", /*keydown_handler_1*/ ctx[28], false, false, false),
    				listen_dev(button, "click", /*click_handler_2*/ ctx[29], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*Name*/ 2 && input0.value !== /*Name*/ ctx[1]) {
    				set_input_value(input0, /*Name*/ ctx[1]);
    			}

    			if (dirty[0] & /*Email*/ 1 && input1.value !== /*Email*/ ctx[0]) {
    				set_input_value(input1, /*Email*/ ctx[0]);
    			}

    			if (dirty[0] & /*Password*/ 4 && input2.value !== /*Password*/ ctx[2]) {
    				set_input_value(input2, /*Password*/ ctx[2]);
    			}

    			if (dirty[0] & /*confirmPassword*/ 8 && input3.value !== /*confirmPassword*/ ctx[3]) {
    				set_input_value(input3, /*confirmPassword*/ ctx[3]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

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
    				if_block.m(div0, null);
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
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$9.name,
    		type: "if",
    		source: "(234:31) ",
    		ctx
    	});

    	return block;
    }

    // (219:4) {#if logPage == true}
    function create_if_block$c(ctx) {
    	let div0;
    	let input0;
    	let br0;
    	let t0;
    	let input1;
    	let br1;
    	let t1;
    	let br2;
    	let a;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let hr;
    	let t5;
    	let div1;
    	let h5;
    	let t6;
    	let br3;
    	let button;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block_1$9, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*loading*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input0 = element("input");
    			br0 = element("br");
    			t0 = space();
    			input1 = element("input");
    			br1 = element("br");
    			t1 = space();
    			br2 = element("br");
    			a = element("a");
    			a.textContent = "Forgot Password?";
    			t3 = space();
    			if_block.c();
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t6 = text("Don't have an Account? ");
    			br3 = element("br");
    			button = element("button");
    			button.textContent = "Sign Up";
    			attr_dev(input0, "id", "logEmail");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Email");
    			input0.required = true;
    			attr_dev(input0, "autocomplete", "off");
    			attr_dev(input0, "class", "svelte-1h77a0u");
    			add_location(input0, file$f, 220, 12, 6631);
    			attr_dev(br0, "class", "svelte-1h77a0u");
    			add_location(br0, file$f, 220, 118, 6737);
    			attr_dev(input1, "id", "logPassword");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "Password");
    			input1.required = true;
    			attr_dev(input1, "autocomplete", "off");
    			attr_dev(input1, "class", "svelte-1h77a0u");
    			add_location(input1, file$f, 221, 12, 6755);
    			attr_dev(br1, "class", "svelte-1h77a0u");
    			add_location(br1, file$f, 221, 186, 6929);
    			attr_dev(br2, "class", "svelte-1h77a0u");
    			add_location(br2, file$f, 222, 12, 6947);
    			attr_dev(a, "id", "forgotPassword");
    			attr_dev(a, "class", "svelte-1h77a0u");
    			add_location(a, file$f, 222, 17, 6952);
    			attr_dev(div0, "id", "login-div");
    			attr_dev(div0, "class", "svelte-1h77a0u");
    			add_location(div0, file$f, 219, 8, 6598);
    			set_style(hr, "border", "1px solid green");
    			attr_dev(hr, "class", "svelte-1h77a0u");
    			add_location(hr, file$f, 229, 8, 7253);
    			attr_dev(br3, "class", "svelte-1h77a0u");
    			add_location(br3, file$f, 231, 39, 7392);
    			attr_dev(button, "class", "login-signup svelte-1h77a0u");
    			attr_dev(button, "id", "signupBtn");
    			add_location(button, file$f, 231, 44, 7397);
    			attr_dev(h5, "class", "svelte-1h77a0u");
    			add_location(h5, file$f, 231, 12, 7365);
    			attr_dev(div1, "class", "no-cred-sign-signup svelte-1h77a0u");
    			attr_dev(div1, "id", "no-Acct-signup");
    			add_location(div1, file$f, 230, 8, 7299);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input0);
    			set_input_value(input0, /*logEmail*/ ctx[4]);
    			append_dev(div0, br0);
    			append_dev(div0, t0);
    			append_dev(div0, input1);
    			set_input_value(input1, /*logPassword*/ ctx[5]);
    			append_dev(div0, br1);
    			append_dev(div0, t1);
    			append_dev(div0, br2);
    			append_dev(div0, a);
    			append_dev(div0, t3);
    			if_blocks[current_block_type_index].m(div0, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h5);
    			append_dev(h5, t6);
    			append_dev(h5, br3);
    			append_dev(h5, button);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[19]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[20]),
    				listen_dev(input1, "keydown", /*keydown_handler*/ ctx[21], false, false, false),
    				listen_dev(a, "click", /*click_handler*/ ctx[22], false, false, false),
    				listen_dev(button, "click", /*click_handler_1*/ ctx[23], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*logEmail*/ 16 && input0.value !== /*logEmail*/ ctx[4]) {
    				set_input_value(input0, /*logEmail*/ ctx[4]);
    			}

    			if (dirty[0] & /*logPassword*/ 32 && input1.value !== /*logPassword*/ ctx[5]) {
    				set_input_value(input1, /*logPassword*/ ctx[5]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

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
    				if_block.m(div0, null);
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
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(219:4) {#if logPage == true}",
    		ctx
    	});

    	return block;
    }

    // (255:12) {:else}
    function create_else_block_2$3(ctx) {
    	let current;
    	const loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$3.name,
    		type: "else",
    		source: "(255:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (253:12) {#if !loading}
    function create_if_block_5$5(ctx) {
    	let br;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			br = element("br");
    			button = element("button");
    			button.textContent = "Reset Password";
    			attr_dev(br, "class", "svelte-1h77a0u");
    			add_location(br, file$f, 253, 16, 8805);
    			attr_dev(button, "class", "btn btn-success svelte-1h77a0u");
    			set_style(button, "margin-bottom", "30px");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$f, 253, 21, 8810);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*forgotPassword*/ ctx[13], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$5.name,
    		type: "if",
    		source: "(253:12) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (242:12) {:else}
    function create_else_block_1$5(ctx) {
    	let current;
    	const loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$5.name,
    		type: "else",
    		source: "(242:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (240:12) {#if !loading}
    function create_if_block_3$5(ctx) {
    	let br;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			br = element("br");
    			button = element("button");
    			button.textContent = "Sign Up";
    			attr_dev(br, "class", "svelte-1h77a0u");
    			add_location(br, file$f, 240, 16, 8177);
    			attr_dev(button, "class", "btn btn-success svelte-1h77a0u");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$f, 240, 21, 8182);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*signUp*/ ctx[10], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$5.name,
    		type: "if",
    		source: "(240:12) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (226:12) {:else}
    function create_else_block$9(ctx) {
    	let current;
    	const loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(226:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (224:12) {#if !loading}
    function create_if_block_1$9(ctx) {
    	let h5;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			button = element("button");
    			button.textContent = "Log In";
    			attr_dev(button, "class", "btn btn-success svelte-1h77a0u");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$f, 224, 20, 7079);
    			attr_dev(h5, "class", "svelte-1h77a0u");
    			add_location(h5, file$f, 224, 16, 7075);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, button);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*signIn*/ ctx[12], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(224:12) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let h3;
    	let t2;
    	let t3;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let if_block0 = /*viewError*/ ctx[8] && create_if_block_6$3(ctx);
    	const if_block_creators = [create_if_block$c, create_if_block_2$9, create_if_block_4$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*logPage*/ ctx[6] == true) return 0;
    		if (/*logPage*/ ctx[6] == false) return 1;
    		if (/*logPage*/ ctx[6] == null) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			h3 = element("h3");
    			h3.textContent = "Checkas.io";
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			if (img.src !== (img_src_value = "images/LOGO-192.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Logo");
    			set_style(img, "height", "80px");
    			attr_dev(img, "class", "svelte-1h77a0u");
    			add_location(img, file$f, 212, 4, 6365);
    			attr_dev(h3, "class", "svelte-1h77a0u");
    			add_location(h3, file$f, 213, 4, 6434);
    			attr_dev(div, "id", "entry");
    			attr_dev(div, "class", "container svelte-1h77a0u");
    			add_location(div, file$f, 211, 0, 6326);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, h3);
    			append_dev(div, t2);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t3);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*viewError*/ ctx[8]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6$3(ctx);
    					if_block0.c();
    					if_block0.m(div, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				} else {
    					if_block1 = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function checkNotifications() {
    	if (Notification.permission == "default" || Notification.permission == "denied") Notification.requestPermission();
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $currSocket;
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(15, $currSocket = $$value));
    	let Email, Name, Password, confirmPassword;
    	let logEmail, logPassword;
    	let request;
    	let logPage = true, loading = false, viewError = false;
    	let errMsg;
    	let screenWidth = screen.width;

    	function signUp() {
    		if (Email != null && Name != null && Password != null && confirmPassword != null && Password == confirmPassword) {
    			$$invalidate(7, loading = true);

    			request = {
    				func: "signUp",
    				email: Email,
    				name: Name,
    				password: Password
    			};

    			console.log("Sending sign up request");

    			invokeFunction(request).then(response => {
    				console.log(response);

    				if (response.msg == "SUCCESS") {
    					request.func = "createUser";
    					createUser();
    					$$invalidate(7, loading = false);
    					showLogin.set(false);
    				} else if (response.msg == "EXIST") {
    					$$invalidate(9, errMsg = "Display Name Already Exist");
    					$$invalidate(8, viewError = true);
    					$$invalidate(7, loading = false);
    				} else {
    					$$invalidate(9, errMsg = response.err);
    					$$invalidate(8, viewError = true);
    					$$invalidate(7, loading = false);
    				}
    			}).catch(err => {
    				$$invalidate(9, errMsg = err);
    				$$invalidate(8, viewError = true);
    				$$invalidate(7, loading = false);
    			});
    		} else {
    			$$invalidate(9, errMsg = "All Fields Are Required");
    			$$invalidate(8, viewError = true);
    			$$invalidate(7, loading = false);
    		}
    	}

    	function checkPasswordMatch() {
    		if (Password != null && confirmPassword.length >= Password.length && confirmPassword != Password) {
    			$$invalidate(9, errMsg = "Passwords Do Not Match!");
    			$$invalidate(8, viewError = true);
    		} else {
    			$$invalidate(8, viewError = false);
    		}
    	}

    	function createUser() {
    		invokeFunction(request).then(response => {
    			console.log(response);

    			if (response.msg == "SUCCESS") {
    				$$invalidate(9, errMsg = "Please Check Your Email For Verification");
    				$$invalidate(8, viewError = true);
    			} else {
    				$$invalidate(9, errMsg = response.err);
    				$$invalidate(8, viewError = true);
    				$$invalidate(7, loading = false);
    			}
    		}).catch(err => {
    			$$invalidate(9, errMsg = err);
    			$$invalidate(8, viewError = true);
    			$$invalidate(7, loading = false);
    		});
    	}

    	function signIn() {
    		if (logEmail != null && logPassword != null) {
    			$$invalidate(7, loading = true);

    			request = {
    				func: "signIn",
    				email: logEmail,
    				password: logPassword
    			};

    			invokeFunction(request).then(response => {
    				if (response.msg != null && response.msg) {
    					request.func = "retrieveUser";
    					retrieveUser();
    				} else if (response.msg != null && !response.msg) {
    					$$invalidate(9, errMsg = "Please Verify Your Email");
    					$$invalidate(8, viewError = true);
    					$$invalidate(7, loading = false);
    				} else {
    					console.log(response.err);
    					$$invalidate(9, errMsg = response.err);
    					$$invalidate(8, viewError = true);
    					$$invalidate(7, loading = false);
    				}
    			}).catch(err => {
    				$$invalidate(9, errMsg = err);
    				console.log(err);
    				$$invalidate(8, viewError = true);
    				$$invalidate(7, loading = false);
    			});
    		} else {
    			$$invalidate(9, errMsg = "All Fields Are Required");
    			$$invalidate(8, viewError = true);
    			$$invalidate(7, loading = false);
    		}
    	}

    	function retrieveUser() {
    		invokeFunction(request).then(response => {
    			//console.log(response);
    			if (response.msg != null) {
    				let data = response.msg;
    				data.email = logEmail;
    				currUser.set(new User(data));
    				checkNotifications();
    				getAllChats();
    				getUserGames();
    				getLeagueTable();
    				($$invalidate(0, Email = ""), $$invalidate(1, Name = ""), $$invalidate(2, Password = ""), $$invalidate(3, confirmPassword = ""));
    				($$invalidate(4, logEmail = ""), $$invalidate(5, logPassword = ""));
    				$currSocket.emit("go-online", logEmail);
    				$$invalidate(7, loading = false);
    				showLogin.set(false);
    				let index = document.getElementById("index");
    				index.setAttribute("style", "top:0;");
    				let enter = document.getElementById("enter");
    				enter.setAttribute("style", "top:-100%;");
    			} else {
    				$$invalidate(9, errMsg = response.err);
    				console.log(response.err);
    				$$invalidate(8, viewError = true);
    				$$invalidate(7, loading = false);
    			}
    		}).catch(err => {
    			console.log(err);
    			$$invalidate(9, errMsg = err);
    			$$invalidate(8, viewError = true);
    			$$invalidate(7, loading = false);
    		});
    	}

    	function forgotPassword() {
    		if (logEmail != null || logEmail != "") {
    			request = { func: "forgotPassword", email: logEmail };

    			invokeFunction(request).then(response => {
    				if (response.msg == "SUCCESS") {
    					$$invalidate(9, errMsg = "Please Check Your Email For Password Reset");
    					$$invalidate(8, viewError = true);
    					$$invalidate(7, loading = false);
    				} else {
    					$$invalidate(9, errMsg = response.err);
    					$$invalidate(8, viewError = true);
    					$$invalidate(7, loading = false);
    				}
    			}).catch(err => {
    				$$invalidate(9, errMsg = err);
    				$$invalidate(8, viewError = true);
    				$$invalidate(7, loading = false);
    			});
    		} else {
    			$$invalidate(9, errMsg = "Please Fill All Required Fields!");
    			$$invalidate(8, viewError = true);
    			$$invalidate(7, loading = false);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$7.warn(`<Entry> was created with unknown prop '${key}'`);
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

    	const keydown_handler = event => event.which === 13 && signIn();
    	const click_handler = () => $$invalidate(6, logPage = null);
    	const click_handler_1 = () => $$invalidate(6, logPage = !logPage);

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

    	const keydown_handler_1 = event => event.which === 13 && signUp();
    	const click_handler_2 = () => $$invalidate(6, logPage = !logPage);

    	function input_input_handler() {
    		logEmail = this.value;
    		$$invalidate(4, logEmail);
    	}

    	const click_handler_3 = () => $$invalidate(6, logPage = true);

    	$$self.$capture_state = () => ({
    		currUser,
    		page,
    		showLogin,
    		gameTab,
    		peer,
    		currSocket,
    		invokeFunction,
    		User,
    		Loader,
    		getUserGames,
    		getLeagueTable,
    		getAllChats,
    		env,
    		Email,
    		Name,
    		Password,
    		confirmPassword,
    		logEmail,
    		logPassword,
    		request,
    		logPage,
    		loading,
    		viewError,
    		errMsg,
    		screenWidth,
    		signUp,
    		checkPasswordMatch,
    		createUser,
    		signIn,
    		checkNotifications,
    		retrieveUser,
    		forgotPassword,
    		$currSocket
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
    		if ("loading" in $$props) $$invalidate(7, loading = $$props.loading);
    		if ("viewError" in $$props) $$invalidate(8, viewError = $$props.viewError);
    		if ("errMsg" in $$props) $$invalidate(9, errMsg = $$props.errMsg);
    		if ("screenWidth" in $$props) screenWidth = $$props.screenWidth;
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
    		loading,
    		viewError,
    		errMsg,
    		signUp,
    		checkPasswordMatch,
    		signIn,
    		forgotPassword,
    		request,
    		$currSocket,
    		screenWidth,
    		createUser,
    		retrieveUser,
    		input0_input_handler,
    		input1_input_handler,
    		keydown_handler,
    		click_handler,
    		click_handler_1,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		keydown_handler_1,
    		click_handler_2,
    		input_input_handler,
    		click_handler_3
    	];
    }

    class Entry extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Entry",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/Components/callNotify.svelte generated by Svelte v3.22.3 */

    const { console: console_1$8 } = globals;
    const file$g = "src/Components/callNotify.svelte";

    // (66:4) {#if $onCall}
    function create_if_block_2$a(ctx) {
    	let div;
    	let t0;
    	let button0;
    	let t2;
    	let button1;
    	let current;
    	let dispose;
    	const player = new AudioPlayer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(player.$$.fragment);
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "Hide";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "End Call";
    			attr_dev(div, "id", "player");
    			attr_dev(div, "class", "svelte-15mfdx6");
    			add_location(div, file$g, 66, 8, 1951);
    			attr_dev(button0, "class", "btn btn-info btn-sm accept svelte-15mfdx6");
    			add_location(button0, file$g, 69, 8, 2014);
    			attr_dev(button1, "class", "btn btn-danger btn-sm decline svelte-15mfdx6");
    			add_location(button1, file$g, 70, 8, 2103);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			mount_component(player, div, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button1, anchor);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*hidePlayer*/ ctx[6], false, false, false),
    				listen_dev(button1, "click", /*endCall*/ ctx[7], false, false, false)
    			];
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(player);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$a.name,
    		type: "if",
    		source: "(66:4) {#if $onCall}",
    		ctx
    	});

    	return block;
    }

    // (74:4) {#if $showCaller}
    function create_if_block_1$a(ctx) {
    	let h3;
    	let t0_value = /*$callerName*/ ctx[2].toUpperCase() + "";
    	let t0;
    	let t1;
    	let t2;
    	let button0;
    	let t4;
    	let button1;
    	let dispose;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = text(" is Calling");
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "Accept";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Decline";
    			attr_dev(h3, "class", "blink svelte-15mfdx6");
    			add_location(h3, file$g, 74, 8, 2229);
    			attr_dev(button0, "class", "btn btn-success btn-sm accept svelte-15mfdx6");
    			add_location(button0, file$g, 75, 8, 2299);
    			attr_dev(button1, "class", "btn btn-danger btn-sm decline svelte-15mfdx6");
    			add_location(button1, file$g, 76, 8, 2393);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button1, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*acceptCall*/ ctx[5], false, false, false),
    				listen_dev(button1, "click", /*endCall*/ ctx[7], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$callerName*/ 4 && t0_value !== (t0_value = /*$callerName*/ ctx[2].toUpperCase() + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(74:4) {#if $showCaller}",
    		ctx
    	});

    	return block;
    }

    // (80:4) {#if $showCallee}
    function create_if_block$d(ctx) {
    	let h3;
    	let t0;
    	let t1_value = /*$calleeName*/ ctx[4].toUpperCase() + "";
    	let t1;
    	let t2;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Calling ");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			button.textContent = "Cancel";
    			attr_dev(h3, "class", "blink svelte-15mfdx6");
    			add_location(h3, file$g, 80, 8, 2518);
    			attr_dev(button, "id", "cancel");
    			attr_dev(button, "class", "btn btn-danger btn-sm svelte-15mfdx6");
    			add_location(button, file$g, 81, 8, 2585);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*endCall*/ ctx[7], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$calleeName*/ 16 && t1_value !== (t1_value = /*$calleeName*/ ctx[4].toUpperCase() + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(80:4) {#if $showCallee}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = /*$onCall*/ ctx[0] && create_if_block_2$a(ctx);
    	let if_block1 = /*$showCaller*/ ctx[1] && create_if_block_1$a(ctx);
    	let if_block2 = /*$showCallee*/ ctx[3] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "id", "stream");
    			attr_dev(div, "class", "svelte-15mfdx6");
    			add_location(div, file$g, 64, 0, 1907);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$onCall*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$onCall*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$a(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$showCaller*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$a(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*$showCallee*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$d(ctx);
    					if_block2.c();
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $currSocket;
    	let $callerID;
    	let $callerSignal;
    	let $onCall;
    	let $peer;
    	let $showPlayer;
    	let $calleeID;
    	let $showCaller;
    	let $callerName;
    	let $showCallee;
    	let $calleeName;
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(8, $currSocket = $$value));
    	validate_store(callerID, "callerID");
    	component_subscribe($$self, callerID, $$value => $$invalidate(9, $callerID = $$value));
    	validate_store(callerSignal, "callerSignal");
    	component_subscribe($$self, callerSignal, $$value => $$invalidate(10, $callerSignal = $$value));
    	validate_store(onCall, "onCall");
    	component_subscribe($$self, onCall, $$value => $$invalidate(0, $onCall = $$value));
    	validate_store(peer, "peer");
    	component_subscribe($$self, peer, $$value => $$invalidate(11, $peer = $$value));
    	validate_store(showPlayer, "showPlayer");
    	component_subscribe($$self, showPlayer, $$value => $$invalidate(12, $showPlayer = $$value));
    	validate_store(calleeID, "calleeID");
    	component_subscribe($$self, calleeID, $$value => $$invalidate(13, $calleeID = $$value));
    	validate_store(showCaller, "showCaller");
    	component_subscribe($$self, showCaller, $$value => $$invalidate(1, $showCaller = $$value));
    	validate_store(callerName, "callerName");
    	component_subscribe($$self, callerName, $$value => $$invalidate(2, $callerName = $$value));
    	validate_store(showCallee, "showCallee");
    	component_subscribe($$self, showCallee, $$value => $$invalidate(3, $showCallee = $$value));
    	validate_store(calleeName, "calleeName");
    	component_subscribe($$self, calleeName, $$value => $$invalidate(4, $calleeName = $$value));

    	function acceptCall() {
    		(showCaller.set(false), showCallBar.set(false));

    		navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
    			let simplePeer = new SimplePeer({ initiator: false, trickle: false, stream });

    			peer.update(state => {
    				state = simplePeer;
    				return state;
    			});

    			simplePeer.on("signal", data => {
    				console.log("Receiving Signal");
    				$currSocket.emit("accept-call", { signal: data, callerID: $callerID });
    			});

    			simplePeer.on("stream", stream => {
    				console.log("Sending Stream");
    				showPlayer.set(true);

    				setTimeout(
    					function () {
    						let audio = document.getElementById("audio");
    						audio.srcObject = stream;
    						onCall.set(true);
    					},
    					500
    				);
    			});

    			simplePeer.signal($callerSignal);
    		}).catch(err => {
    			console.log(err);
    		});
    	}

    	function hidePlayer() {
    		showPlayer.set(true);
    		showCallBar.set(false);
    	}

    	function endCall() {
    		if ($onCall) {
    			let audio = document.getElementById("audio");
    			audio.src = "";
    			onCall.set(false);
    			$peer.destroy();
    			if ($showPlayer) showPlayer.set(false);
    		}

    		$currSocket.emit("end-call", { calleeID: $calleeID, callerID: $callerID });
    		showCallBar.set(false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$8.warn(`<CallNotify> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CallNotify", $$slots, []);

    	$$self.$capture_state = () => ({
    		onCall,
    		showCaller,
    		showCallee,
    		callerName,
    		calleeName,
    		peer,
    		calleeID,
    		currSocket,
    		callerSignal,
    		showCallBar,
    		callerID,
    		showPlayer,
    		currentTime,
    		Player: AudioPlayer,
    		acceptCall,
    		hidePlayer,
    		endCall,
    		$currSocket,
    		$callerID,
    		$callerSignal,
    		$onCall,
    		$peer,
    		$showPlayer,
    		$calleeID,
    		$showCaller,
    		$callerName,
    		$showCallee,
    		$calleeName
    	});

    	return [
    		$onCall,
    		$showCaller,
    		$callerName,
    		$showCallee,
    		$calleeName,
    		acceptCall,
    		hidePlayer,
    		endCall
    	];
    }

    class CallNotify extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CallNotify",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/Pages/gamePlay.svelte generated by Svelte v3.22.3 */
    const file$h = "src/Pages/gamePlay.svelte";

    // (72:0) {#if $showCallBar}
    function create_if_block_13(ctx) {
    	let current;
    	const call = new CallNotify({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(call.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(call, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(call.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(call.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(call, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(72:0) {#if $showCallBar}",
    		ctx
    	});

    	return block;
    }

    // (96:0) {:else}
    function create_else_block_2$4(ctx) {
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5$6, create_if_block_7$3, create_if_block_12];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (/*$gameTab*/ ctx[5] == 0) return 0;
    		if (/*$gameTab*/ ctx[5] > 0 && /*$gameTab*/ ctx[5] < 5) return 1;
    		if (/*$gameTab*/ ctx[5] == 5) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_3(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block1 = /*$showNavBar*/ ctx[6] && /*$currUser*/ ctx[4] != null && /*$currUser*/ ctx[4].isAuth && create_if_block_4$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_3(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				} else {
    					if_block0 = null;
    				}
    			}

    			if (/*$showNavBar*/ ctx[6] && /*$currUser*/ ctx[4] != null && /*$currUser*/ ctx[4].isAuth) {
    				if (if_block1) {
    					if (dirty & /*$showNavBar, $currUser*/ 80) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4$6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$4.name,
    		type: "else",
    		source: "(96:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:0) {#if $ratio > 1}
    function create_if_block$e(ctx) {
    	let t0;
    	let current_block_type_index;
    	let if_block1;
    	let t1;
    	let current;
    	let if_block0 = (/*showChat*/ ctx[0] || /*$showLogin*/ ctx[3]) && create_if_block_2$b(ctx);
    	const if_block_creators = [create_if_block_1$b, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*$currUser*/ ctx[4] != null && /*$currUser*/ ctx[4].isAuth) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const game = new GameBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if_block1.c();
    			t1 = space();
    			create_component(game.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(game, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*showChat*/ ctx[0] || /*$showLogin*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*showChat, $showLogin*/ 9) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$b(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(t1.parentNode, t1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(game, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(76:0) {#if $ratio > 1}",
    		ctx
    	});

    	return block;
    }

    // (131:25) 
    function create_if_block_12(ctx) {
    	let current;
    	const game = new GameBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(game.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(game, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(game, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(131:25) ",
    		ctx
    	});

    	return block;
    }

    // (119:40) 
    function create_if_block_7$3(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_8$3, create_if_block_9$1, create_if_block_10$1, create_if_block_11];
    	const if_blocks = [];

    	function select_block_type_5(ctx, dirty) {
    		if (/*$gameTab*/ ctx[5] == 1) return 0;
    		if (/*$gameTab*/ ctx[5] == 2) return 1;
    		if (/*$gameTab*/ ctx[5] == 3) return 2;
    		if (/*$gameTab*/ ctx[5] == 4) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_5(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "backcolor svelte-13morja");
    			add_location(div, file$h, 119, 2, 3937);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_5(ctx);

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
    					if_block.m(div, null);
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
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$3.name,
    		type: "if",
    		source: "(119:40) ",
    		ctx
    	});

    	return block;
    }

    // (97:1) {#if $gameTab == 0}
    function create_if_block_5$6(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let button;
    	let t5;
    	let i;
    	let t6;
    	let hr;
    	let t7;
    	let div2_outro;
    	let t8;
    	let div3;
    	let current;
    	let dispose;
    	const entry = new Entry({ $$inline: true });
    	const join = new GameJoin({ $$inline: true });

    	function select_block_type_4(ctx, dirty) {
    		if (/*$currUser*/ ctx[4] != null && /*$currUser*/ ctx[4].isAuth) return create_if_block_6$4;
    		return create_else_block_3$1;
    	}

    	let current_block_type = select_block_type_4(ctx);
    	let if_block = current_block_type(ctx);
    	const create = new GameCreate({ $$inline: true });

    	const block = {
    		c: function create$1() {
    			div0 = element("div");
    			create_component(entry.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(join.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Checkas.io";
    			t4 = space();
    			button = element("button");
    			t5 = text("vs Computer ");
    			i = element("i");
    			t6 = space();
    			hr = element("hr");
    			t7 = space();
    			if_block.c();
    			t8 = space();
    			div3 = element("div");
    			create_component(create.$$.fragment);
    			attr_dev(div0, "id", "enter");
    			attr_dev(div0, "class", "svelte-13morja");
    			add_location(div0, file$h, 97, 2, 3010);
    			attr_dev(div1, "id", "join");
    			attr_dev(div1, "class", "backcolor svelte-13morja");
    			add_location(div1, file$h, 100, 2, 3053);
    			attr_dev(img, "alt", "logo");
    			if (img.src !== (img_src_value = "./images/LOGO-192.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-13morja");
    			add_location(img, file$h, 104, 3, 3160);
    			attr_dev(h3, "id", "home");
    			attr_dev(h3, "class", "svelte-13morja");
    			add_location(h3, file$h, 105, 3, 3211);
    			attr_dev(i, "class", "fa fa-desktop");
    			add_location(i, file$h, 106, 92, 3334);
    			attr_dev(button, "class", "btn btn-secondary btn-lg svelte-13morja");
    			add_location(button, file$h, 106, 3, 3245);
    			attr_dev(hr, "class", "svelte-13morja");
    			add_location(hr, file$h, 107, 3, 3377);
    			attr_dev(div2, "id", "index");
    			attr_dev(div2, "class", "backcolor svelte-13morja");
    			add_location(div2, file$h, 103, 2, 3112);
    			attr_dev(div3, "id", "create");
    			attr_dev(div3, "class", "backcolor svelte-13morja");
    			add_location(div3, file$h, 115, 2, 3832);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			mount_component(entry, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(join, div1, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, img);
    			append_dev(div2, t2);
    			append_dev(div2, h3);
    			append_dev(div2, t4);
    			append_dev(div2, button);
    			append_dev(button, t5);
    			append_dev(button, i);
    			append_dev(div2, t6);
    			append_dev(div2, hr);
    			append_dev(div2, t7);
    			if_block.m(div2, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(create, div3, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[12], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entry.$$.fragment, local);
    			transition_in(join.$$.fragment, local);
    			if (div2_outro) div2_outro.end(1);
    			transition_in(create.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entry.$$.fragment, local);
    			transition_out(join.$$.fragment, local);
    			div2_outro = create_out_transition(div2, fade, {});
    			transition_out(create.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(entry);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(join);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			if_block.d();
    			if (detaching && div2_outro) div2_outro.end();
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div3);
    			destroy_component(create);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$6.name,
    		type: "if",
    		source: "(97:1) {#if $gameTab == 0}",
    		ctx
    	});

    	return block;
    }

    // (127:27) 
    function create_if_block_11(ctx) {
    	let current;
    	const account = new Settings({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(account.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(account, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(account.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(account.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(account, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(127:27) ",
    		ctx
    	});

    	return block;
    }

    // (125:27) 
    function create_if_block_10$1(ctx) {
    	let current;
    	const chat = new GameChat({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(chat.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chat, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(125:27) ",
    		ctx
    	});

    	return block;
    }

    // (123:27) 
    function create_if_block_9$1(ctx) {
    	let current;
    	const league = new LeaderBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(league.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(league, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(league.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(league.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(league, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(123:27) ",
    		ctx
    	});

    	return block;
    }

    // (121:3) {#if $gameTab ==1}
    function create_if_block_8$3(ctx) {
    	let current;
    	const list = new GameList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(list.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(list, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(list.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(list.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(list, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$3.name,
    		type: "if",
    		source: "(121:3) {#if $gameTab ==1}",
    		ctx
    	});

    	return block;
    }

    // (112:3) {:else}
    function create_else_block_3$1(ctx) {
    	let button;
    	let t;
    	let i;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Login/Register ");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-sign-in");
    			add_location(i, file$h, 112, 81, 3770);
    			attr_dev(button, "class", "btn btn-primary btn-lg svelte-13morja");
    			add_location(button, file$h, 112, 4, 3693);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			append_dev(button, i);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", viewEntry, false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3$1.name,
    		type: "else",
    		source: "(112:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (109:3) {#if $currUser != null && $currUser.isAuth}
    function create_if_block_6$4(ctx) {
    	let button0;
    	let t0;
    	let i0;
    	let t1;
    	let button1;
    	let t2;
    	let i1;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			t0 = text("Create Game ");
    			i0 = element("i");
    			t1 = space();
    			button1 = element("button");
    			t2 = text("Join Game ");
    			i1 = element("i");
    			attr_dev(i0, "class", "fa fa-plus");
    			add_location(i0, file$h, 109, 85, 3517);
    			attr_dev(button0, "class", "btn btn-secondary btn-lg svelte-13morja");
    			add_location(button0, file$h, 109, 4, 3436);
    			attr_dev(i1, "class", "fa fa-user-plus");
    			add_location(i1, file$h, 110, 81, 3635);
    			attr_dev(button1, "class", "btn btn-secondary btn-lg svelte-13morja");
    			add_location(button1, file$h, 110, 4, 3558);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, t0);
    			append_dev(button0, i0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, t2);
    			append_dev(button1, i1);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", viewCreateGame$1, false, false, false),
    				listen_dev(button1, "click", viewJoinGame$1, false, false, false)
    			];
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$4.name,
    		type: "if",
    		source: "(109:3) {#if $currUser != null && $currUser.isAuth}",
    		ctx
    	});

    	return block;
    }

    // (135:1) {#if $showNavBar && $currUser != null && $currUser.isAuth}
    function create_if_block_4$6(ctx) {
    	let current;
    	const nav = new NavBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$6.name,
    		type: "if",
    		source: "(135:1) {#if $showNavBar && $currUser != null && $currUser.isAuth}",
    		ctx
    	});

    	return block;
    }

    // (77:1) {#if showChat || $showLogin}
    function create_if_block_2$b(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let dispose;
    	const blur = new BlurScreen({ $$inline: true });
    	const if_block_creators = [create_if_block_3$6, create_else_block_1$6];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*showChat*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(blur.$$.fragment);
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(div, file$h, 77, 2, 2424);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			mount_component(blur, div, null);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(div, "click", /*closeAll*/ ctx[7], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
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
    			transition_in(blur.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blur.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(blur);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$b.name,
    		type: "if",
    		source: "(77:1) {#if showChat || $showLogin}",
    		ctx
    	});

    	return block;
    }

    // (83:2) {:else}
    function create_else_block_1$6(ctx) {
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
    		id: create_else_block_1$6.name,
    		type: "else",
    		source: "(83:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (81:2) {#if showChat}
    function create_if_block_3$6(ctx) {
    	let current;
    	const chat = new GameChat({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(chat.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chat, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$6.name,
    		type: "if",
    		source: "(81:2) {#if showChat}",
    		ctx
    	});

    	return block;
    }

    // (91:1) {:else}
    function create_else_block$a(ctx) {
    	let button;
    	let t;
    	let i;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Login/Register ");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-sign-in");
    			add_location(i, file$h, 91, 133, 2917);
    			attr_dev(button, "class", "btn btn-dark btn-lg navi svelte-13morja");
    			set_style(button, "right", "5px");
    			set_style(button, "position", "fixed");
    			add_location(button, file$h, 91, 2, 2786);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			append_dev(button, i);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[11], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(91:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (88:1) {#if $currUser != null && $currUser.isAuth}
    function create_if_block_1$b(ctx) {
    	let button;
    	let t0;
    	let i;
    	let t1;
    	let current;
    	let dispose;
    	const sidebar = new SideBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text("Chat Board ");
    			i = element("i");
    			t1 = space();
    			create_component(sidebar.$$.fragment);
    			attr_dev(i, "class", "fa fa-comments");
    			add_location(i, file$h, 88, 125, 2719);
    			attr_dev(button, "class", "btn btn-dark btn-lg navi svelte-13morja");
    			set_style(button, "right", "5px");
    			set_style(button, "position", "fixed");
    			add_location(button, file$h, 88, 2, 2596);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, i);
    			insert_dev(target, t1, anchor);
    			mount_component(sidebar, target, anchor);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[10], false, false, false);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			destroy_component(sidebar, detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(88:1) {#if $currUser != null && $currUser.isAuth}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block1;
    	let if_block1_anchor;
    	let current;
    	const socket = new SocketRecv({ $$inline: true });
    	let if_block0 = /*$showCallBar*/ ctx[1] && create_if_block_13(ctx);
    	const if_block_creators = [create_if_block$e, create_else_block_2$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$ratio*/ ctx[2] > 1) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(socket.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(socket, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$showCallBar*/ ctx[1]) {
    				if (if_block0) {
    					if (dirty & /*$showCallBar*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_13(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

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
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(socket.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(socket.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(socket, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function viewCreateGame$1() {
    	let index = document.getElementById("index");
    	index.setAttribute("style", "left:-100%");
    	let create = document.getElementById("create");
    	create.setAttribute("style", "left:0;");
    }

    function viewJoinGame$1() {
    	let index = document.getElementById("index");
    	index.setAttribute("style", "left:100%");
    	let join = document.getElementById("join");
    	join.setAttribute("style", "left:0;");
    }

    function viewEntry() {
    	let index = document.getElementById("index");
    	index.setAttribute("style", "top:100%;");
    	let enter = document.getElementById("enter");
    	enter.setAttribute("style", "top:0;");
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $onCall;
    	let $startTimeStamp;
    	let $showCallBar;
    	let $ratio;
    	let $showLogin;
    	let $currUser;
    	let $gameTab;
    	let $showNavBar;
    	validate_store(onCall, "onCall");
    	component_subscribe($$self, onCall, $$value => $$invalidate(8, $onCall = $$value));
    	validate_store(startTimeStamp, "startTimeStamp");
    	component_subscribe($$self, startTimeStamp, $$value => $$invalidate(9, $startTimeStamp = $$value));
    	validate_store(showCallBar, "showCallBar");
    	component_subscribe($$self, showCallBar, $$value => $$invalidate(1, $showCallBar = $$value));
    	validate_store(ratio, "ratio");
    	component_subscribe($$self, ratio, $$value => $$invalidate(2, $ratio = $$value));
    	validate_store(showLogin, "showLogin");
    	component_subscribe($$self, showLogin, $$value => $$invalidate(3, $showLogin = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(4, $currUser = $$value));
    	validate_store(gameTab, "gameTab");
    	component_subscribe($$self, gameTab, $$value => $$invalidate(5, $gameTab = $$value));
    	validate_store(showNavBar, "showNavBar");
    	component_subscribe($$self, showNavBar, $$value => $$invalidate(6, $showNavBar = $$value));
    	let showChat = false;

    	function closeAll() {
    		if ($onCall) {
    			showCallBar.set(true);

    			setTimeout(
    				function () {
    					window.$("#stream").draggable();
    				},
    				1000
    			);
    		}

    		$$invalidate(0, showChat = false);
    		showLogin.set(false);
    	}

    	setInterval(
    		function () {
    			if ($onCall) {
    				$startTimeStamp.add(1, "second");
    				currentTime.set($startTimeStamp.format("HH:mm:ss"));
    			}
    		},
    		1000
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GamePlay> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GamePlay", $$slots, []);
    	const click_handler = () => $$invalidate(0, showChat = true);
    	const click_handler_1 = () => showLogin.set(true);
    	const click_handler_2 = () => gameTab.set(5);

    	$$self.$capture_state = () => ({
    		Position,
    		Board,
    		spring,
    		writable,
    		invokeFunction,
    		fly,
    		fade,
    		gameBoard,
    		gameHistory,
    		gamePref,
    		currSocket,
    		currUser,
    		onCall,
    		startTimeStamp,
    		ratio,
    		gameTab,
    		allChats,
    		showLogin,
    		showNavBar,
    		showCallBar,
    		showPlayer,
    		currentTime,
    		Chat: GameChat,
    		Game: GameBoard,
    		Nav: NavBar,
    		Socket: SocketRecv,
    		SideBar,
    		Blur: BlurScreen,
    		Entry,
    		League: LeaderBoard,
    		Account: Settings,
    		List: GameList,
    		Create: GameCreate,
    		Join: GameJoin,
    		Call: CallNotify,
    		showChat,
    		viewCreateGame: viewCreateGame$1,
    		viewJoinGame: viewJoinGame$1,
    		viewEntry,
    		closeAll,
    		$onCall,
    		$startTimeStamp,
    		$showCallBar,
    		$ratio,
    		$showLogin,
    		$currUser,
    		$gameTab,
    		$showNavBar
    	});

    	$$self.$inject_state = $$props => {
    		if ("showChat" in $$props) $$invalidate(0, showChat = $$props.showChat);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showChat,
    		$showCallBar,
    		$ratio,
    		$showLogin,
    		$currUser,
    		$gameTab,
    		$showNavBar,
    		closeAll,
    		$onCall,
    		$startTimeStamp,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class GamePlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GamePlay",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.22.3 */

    function create_fragment$l(ctx) {
    	let current;
    	const play = new GamePlay({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(play.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(play, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(play.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(play.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(play, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Play: GamePlay });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
