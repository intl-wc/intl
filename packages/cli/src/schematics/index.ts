import ROUTE from './route.schematic';
import CONFIG from './intl.config.schematic';
import SRC_DIR_README from './readme.schematic';
import * as d from './declarations';

export const SCHEMATICS: d.Schematic[] = [
    CONFIG, SRC_DIR_README, ROUTE
]
export * from './declarations';