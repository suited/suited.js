/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   Karl_Roberts
* @Last modified time: 2016-Aug-02
* @License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/



import docMode         from './doc';
import lectureMode     from './lecture';
import thedeckMode     from './deck';
import walkthroughMode from './walkthrough';
import speakerMode     from './speaker';

var builtins = [];

builtins.push(docMode);
builtins.push(thedeckMode);
builtins.push(walkthroughMode);
builtins.push(lectureMode);
builtins.push(speakerMode);

export default builtins;
