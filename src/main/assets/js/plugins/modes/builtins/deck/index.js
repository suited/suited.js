import Mode from '../../mode';
import modeutils from '../../utils';

import {onBeforeSlideChange, onAfterSlideChange, onBeforeModeChange, onCleanUp} from './deck'; //'./index-old';

let name = "deck";
export default new Mode(name, onBeforeSlideChange, onAfterSlideChange, onBeforeModeChange, null, onCleanUp, modeutils.getShouldShowSlideFunction(name));