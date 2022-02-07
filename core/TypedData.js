import { UID } from '../utils/UID.js';
import { Data } from './Data.js';

const MSG_NAME = '[Typed State] Wrong property name: ';
const MSG_TYPE = '[Typed State] Wrong property type: ';

export class TypedData {
  /**
   * @param {Object<string, { type: any; value: * }>} typedSchema
   * @param {String} [ctxName]
   */
  constructor(typedSchema, ctxName) {
    this.__typedSchema = typedSchema;
    this.__ctxId = ctxName || UID.generate();
    this.__schema = Object.keys(typedSchema).reduce((acc, key) => {
      acc[key] = typedSchema[key].value;
      return acc;
    }, {});
    this.__state = Data.registerNamedCtx(this.__ctxId, this.__schema);
  }

  /**
   * @param {String} prop
   * @param {any} value
   */
  setValue(prop, value) {
    if (!this.__typedSchema.hasOwnProperty(prop)) {
      console.warn(MSG_NAME + prop);
      return;
    }
    if (value?.constructor !== this.__typedSchema[prop].type) {
      console.warn(MSG_TYPE + prop);
      return;
    }
    this.__state.pub(prop, value);
  }

  /** @param {Object<string, any>} updObj */
  setMultipleValues(updObj) {
    for (let prop in updObj) {
      this.setValue(prop, updObj[prop]);
    }
  }

  /** @param {String} prop */
  getValue(prop) {
    if (!this.__typedSchema.hasOwnProperty(prop)) {
      console.warn(MSG_NAME + prop);
      return undefined;
    }
    return this.__state.read(prop);
  }

  /**
   * @param {String} prop
   * @param {(newVal: any) => void} handler
   */
  subscribe(prop, handler) {
    return this.__state.sub(prop, handler);
  }

  remove() {
    this.__state.remove();
  }
}
