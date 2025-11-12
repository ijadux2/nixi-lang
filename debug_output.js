const fs = require('fs');
const path = require('path');
const GUIRenderer = require('./gui-renderer');

// Nixi Runtime Utilities
class NixiValue {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  static fromNative(value) {
    if (value === null || value === undefined) {
      return new NixiValue('null', null);
    }
    if (typeof value === 'boolean') {
      return new NixiValue('boolean', value);
    }
    if (typeof value === 'number') {
      return new NixiValue('number', value);
    }
    if (typeof value === 'string') {
      return new NixiValue('string', value);
    }
    if (Array.isArray(value)) {
      return new NixiValue('array', value.map(NixiValue.fromNative));
    }
    if (typeof value === 'object') {
      const obj = {};
      for (const [key, val] of Object.entries(value)) {
        obj[key] = NixiValue.fromNative(val);
      }
      return new NixiValue('object', obj);
    }
    if (typeof value === 'function') {
      return new NixiValue('function', value);
    }
    
    return new NixiValue('unknown', value);
  }

  toNative() {
    if (this.type === 'null') return null;
    if (this.type === 'boolean') return this.value;
    if (this.type === 'number') return this.value;
    if (this.type === 'string') return this.value;
    if (this.type === 'array') return this.value.map(v => v.toNative());
    if (this.type === 'object') {
      const obj = {};
      for (const [key, val] of Object.entries(this.value)) {
        obj[key] = val.toNative();
      }
      return obj;
    }
    if (this.type === 'function') return this.value;
    
    return this.value;
  }

  toString() {
    if (this.type === 'string') return '"' + this.value + '"';
    if (this.type === 'null') return 'null';
    if (this.type === 'array') {
      return '[' + this.value.map(v => v.toString()).join(', ') + ']';
    }
    if (this.type === 'object') {
      const props = Object.entries(this.value)
        .map(([key, val]) => key + ' = ' + val.toString())
        .join(', ');
      return '{ ' + props + ' }';
    }
    return String(this.value);
  }
}

// Built-in functions
const builtins = {
  add: (a, b) => new NixiValue('number', a.toNative() + b.toNative()),
  multiply: (a, b) => new NixiValue('number', a.toNative() * b.toNative()),
  subtract: (a, b) => new NixiValue('number', a.toNative() - b.toNative()),
  divide: (a, b) => new NixiValue('number', a.toNative() / b.toNative()),
  echo: (...args) => {
    const message = args.map(arg => arg.toNative()).join(' ');
    console.log(message);
    return new NixiValue('null', null);
  },
  concat: (a, b) => new NixiValue('string', a.toNative() + b.toNative()),
  toString: (value) => new NixiValue('string', String(value.toNative())),
  map: (f, list) => {
    if (list.type !== 'array') {
      throw new Error('map expects array as second argument');
    }
    const result = list.value.map(item => f.value(item));
    return new NixiValue('array', result);
  },
  length: (arr) => {
    if (arr.type === 'array') {
      return new NixiValue('number', arr.value.length);
    }
    if (arr.type === 'string') {
      return new NixiValue('number', arr.value.length);
    }
    throw new Error('length expects array or string');
  },
  ls: (dir) => {
    const dirPath = dir.toNative() || '.';
    try {
      const files = fs.readdirSync(dirPath);
      return NixiValue.fromNative(files);
    } catch (error) {
      throw new Error('ls failed: ' + error.message);
    }
  },
  cd: (dir) => {
    const dirPath = dir.toNative();
    try {
      process.chdir(dirPath);
      return new NixiValue('null', null);
    } catch (error) {
      throw new Error('cd failed: ' + error.message);
    }
  },
  pwd: () => NixiValue.fromNative(process.cwd()),
  div: (props) => NixiValue.fromNative({
    type: 'div',
    props: props.toNative()
  }),
  span: (props) => NixiValue.fromNative({
    type: 'span',
    props: props.toNative()
  }),
  button: (props) => NixiValue.fromNative({
    type: 'button',
    props: props.toNative()
  }),
  input: (props) => NixiValue.fromNative({
    type: 'input',
    props: props.toNative()
  }),
  h1: (props) => NixiValue.fromNative({
    type: 'h1',
    props: props.toNative()
  }),
  h2: (props) => NixiValue.fromNative({
    type: 'h2',
    props: props.toNative()
  }),
  h3: (props) => NixiValue.fromNative({
    type: 'h3',
    props: props.toNative()
  }),
  p: (props) => NixiValue.fromNative({
    type: 'p',
    props: props.toNative()
  }),
  a: (props) => NixiValue.fromNative({
    type: 'a',
    props: props.toNative()
  })
};

let guiRenderer = null;
const getGUIRenderer = () => {
  if (!guiRenderer) {
    guiRenderer = new GUIRenderer();
  }
  return guiRenderer;
};

builtins.renderHTML = (component, title) => {
  const html = getGUIRenderer().generateHTML(component, title.toNative());
  return new NixiValue('string', html);
};

builtins.saveHTML = (component, filename, title) => {
  const html = getGUIRenderer().generateHTML(component, title.toNative());
  getGUIRenderer().saveToFile(html, filename.toNative());
  return new NixiValue('null', null);
};

builtins.addStyle = (selector, properties) => {
  getGUIRenderer().addStyle(selector.toNative(), properties.toNative());
  return new NixiValue('null', null);
};


(function() {
  const properties = {"max-width":"1200px","margin":"0 auto","padding":"20px","font-family":"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"};
  getGUIRenderer().addStyle("dashboard", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"background":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","color":"white","padding":"30px","border-radius":"12px","margin-bottom":"30px","text-align":"center"};
  getGUIRenderer().addStyle("dashboard-header", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"display":"flex","flex-wrap":"wrap","gap":"20px","margin-bottom":"30px"};
  getGUIRenderer().addStyle("stats-grid", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"background":"white","padding":"25px","border-radius":"12px","box-shadow":"0 4px 15px rgba(0, 0, 0, 0.1)","text-align":"center","transition":"transform 0.2s ease","flex":"1","min-width":"250px"};
  getGUIRenderer().addStyle("stat-card", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"background":"white","padding":"25px","border-radius":"12px","box-shadow":"0 4px 15px rgba(0, 0, 0, 0.1)","text-align":"center","transition":"transform 0.2s ease"};
  getGUIRenderer().addStyle("stat-card", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"transform":"translateY(-5px)"};
  getGUIRenderer().addStyle("stat-card:hover", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"font-size":"2.5em","font-weight":"bold","color":"#667eea","margin-bottom":"10px"};
  getGUIRenderer().addStyle("stat-number", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"color":"#666","font-size":"1.1em","font-weight":"500"};
  getGUIRenderer().addStyle("stat-label", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"background":"white","padding":"30px","border-radius":"12px","box-shadow":"0 4px 15px rgba(0, 0, 0, 0.1)"};
  getGUIRenderer().addStyle("actions-section", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"display":"flex","gap":"15px","justify-content":"center","flex-wrap":"wrap"};
  getGUIRenderer().addStyle("action-buttons", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"background":"#667eea","color":"white","border":"none","padding":"12px 24px","border-radius":"8px","font-size":"16px","font-weight":"600","cursor":"pointer","transition":"all 0.2s ease"};
  getGUIRenderer().addStyle("btn-primary", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"background":"#f8f9fa","color":"#333","border":"1px solid #dee2e6","padding":"12px 24px","border-radius":"8px","font-size":"16px","font-weight":"600","cursor":"pointer","transition":"all 0.2s ease"};
  getGUIRenderer().addStyle("btn-secondary", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"background":"#5a6fd8","transform":"translateY(-2px)"};
  getGUIRenderer().addStyle("btn-primary:hover", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"background":"#e9ecef","transform":"translateY(-2px)"};
  getGUIRenderer().addStyle("btn-secondary:hover", properties);
  return new NixiValue('null', null);
})();
(function() {
  const appName = new NixiValue('string', "Nixi Dashboard");
  const version = new NixiValue('string', "v1.0.0");
  const usersStat = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-card"), "children": new NixiValue('array', [(builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-number"), "text": new NixiValue('string', "1,234") })), (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-label"), "text": new NixiValue('string', "Total Users") }))]) }));
  const sessionsStat = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-card"), "children": new NixiValue('array', [(builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-number"), "text": new NixiValue('string', "456") })), (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-label"), "text": new NixiValue('string', "Active Sessions") }))]) }));
  const signupsStat = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-card"), "children": new NixiValue('array', [(builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-number"), "text": new NixiValue('string', "89") })), (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-label"), "text": new NixiValue('string', "New Signups") }))]) }));
  const apiStat = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-card"), "children": new NixiValue('array', [(builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-number"), "text": new NixiValue('string', "12.5K") })), (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stat-label"), "text": new NixiValue('string', "API Calls") }))]) }));
  const Header = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "dashboard-header"), "children": new NixiValue('array', [(builtins.h1)(new NixiValue('object', { "text": appName })), (builtins.p)(new NixiValue('object', { "text": (function() { 
          const l = new NixiValue('string', "Functional Programming Dashboard "); 
          const r = version; 
          if (l.type === 'number' && r.type === 'number') {
            return new NixiValue('number', l.value + r.value);
          }
          if (l.type === 'string' || r.type === 'string') {
            return new NixiValue('string', l.toNative() + r.toNative());
          }
          throw new Error('Invalid operands for +');
        })() }))]) }));
  const StatsSection = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "stats-grid"), "children": new NixiValue('array', [usersStat, sessionsStat, signupsStat, apiStat]) }));
  const ActionsSection = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "actions-section"), "children": new NixiValue('array', [(builtins.h2)(new NixiValue('object', { "text": new NixiValue('string', "Quick Actions") })), (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "action-buttons"), "children": new NixiValue('array', [(builtins.button)(new NixiValue('object', { "class": new NixiValue('string', "btn-primary"), "text": new NixiValue('string', "Refresh Data"), "onClick": (builtins.echo)(new NixiValue('string', "Refreshing dashboard data...")) })), (builtins.button)(new NixiValue('object', { "class": new NixiValue('string', "btn-secondary"), "text": new NixiValue('string', "Export Report"), "onClick": (builtins.echo)(new NixiValue('string', "Exporting dashboard report...")) })), (builtins.button)(new NixiValue('object', { "class": new NixiValue('string', "btn-secondary"), "text": new NixiValue('string', "Settings"), "onClick": (builtins.echo)(new NixiValue('string', "Opening dashboard settings...")) }))]) }))]) }));
  const Dashboard = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "dashboard"), "children": new NixiValue('array', [Header, StatsSection, ActionsSection]) }));
  return (builtins.saveHTML)(Dashboard, new NixiValue('string', "dashboard.html"), new NixiValue('string', "Nixi Dashboard"));
})();
