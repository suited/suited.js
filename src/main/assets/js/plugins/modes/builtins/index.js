import docMode         from './doc';
import lectureMode     from './lecture';
import thedeckMode     from './deck';
import walkthroughMode from './walkthrough';

var builtins = [];

builtins.push(docMode);
builtins.push(thedeckMode);
builtins.push(walkthroughMode);
builtins.push(lectureMode);

export default builtins;