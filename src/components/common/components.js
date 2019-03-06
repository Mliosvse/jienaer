import jnButton from './jnButton';
import jnFormbox from './jnFormbox';
import jnCheckbox from './jnCheckbox';
import jnTip from './jnTip';
import jnItem from './jnItem';
import jnCell from './jnCell';
import jnLabel from './jnLabel';

export default (Vue)=>{
    Vue.component("jnButton",jnButton);
    Vue.component("jnFormbox",jnFormbox);
    Vue.component("jnCheckbox",jnCheckbox);
    Vue.component("jnTip",jnTip);
    Vue.component("jnItem", jnItem);
    Vue.component("jnCell", jnCell);
    Vue.component("jnLabel", jnLabel);
}