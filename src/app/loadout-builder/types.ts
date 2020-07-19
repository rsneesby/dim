import _ from 'lodash';
import { Armor2ModPlugCategories } from 'app/utils/item-utils';
import { DimItem } from '../inventory/item-types';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { InventoryBucket } from 'app/inventory/inventory-buckets';

export type StatTypes =
  | 'Mobility'
  | 'Resilience'
  | 'Recovery'
  | 'Discipline'
  | 'Intellect'
  | 'Strength';

export type BurnTypes = 'arc' | 'solar' | 'void';

export interface MinMax {
  min: number;
  max: number;
}

export interface MinMaxIgnored {
  min: number;
  max: number;
  ignored: boolean;
}

export interface BurnItem {
  dmg: BurnTypes;
  displayProperties: {
    name: string;
    icon: string;
  };
}

export interface LockedItemCase {
  type: 'item';
  item: DimItem;
  bucket: InventoryBucket;
}
export interface LockedPerk {
  type: 'perk';
  perk: DestinyInventoryItemDefinition;
  bucket: InventoryBucket;
}
export interface LockedModBase {
  mod: DestinyInventoryItemDefinition;
  plugSetHash: number;
}
export interface LockedMod extends LockedModBase {
  type: 'mod';
  bucket: InventoryBucket;
}
export interface LockedBurn {
  type: 'burn';
  burn: BurnItem;
  bucket: InventoryBucket;
}
export interface LockedExclude {
  type: 'exclude';
  item: DimItem;
  bucket: InventoryBucket;
}

export type LockedItemType = LockedItemCase | LockedPerk | LockedMod | LockedBurn | LockedExclude;

/** A map from bucketHash or seasonal to the list of locked and excluded perks, items, and burns. */
export type LockedMap = Readonly<{
  [bucketHash: number]: readonly LockedItemType[] | undefined;
}>;

export const ModPickerCategories = { ...Armor2ModPlugCategories, seasonal: 'seasonal' } as const;
export type ModPickerCategory = typeof ModPickerCategories[keyof typeof ModPickerCategories];

export interface LockedArmor2Mod {
  /** Essentially an identifier for each mod, as a single mod definition can be selected multiple times.*/
  key: number;
  mod: DestinyInventoryItemDefinition;
  category: ModPickerCategory;
}

export type LockedArmor2ModMap = {
  [T in ModPickerCategory]: LockedArmor2Mod[];
};

/**
 * An individual "stat mix" of loadouts where each slot has a list of items with the same stat options.
 */
export interface ArmorSet {
  /** The overall stats for the loadout as a whole. */
  readonly stats: Readonly<{ [statType in StatTypes]: number }>;

  /**
   * Potential stat mixes that can achieve the overall stats.
   * Each mix is a particular set of stat choices (and options for each piece within that)
   * to get to the overall stats.
   */
  readonly sets: {
    /** For each armor type (see LockableBuckets), this is the list of items that could interchangeably be put into this loadout. */
    readonly armor: readonly DimItem[][];
    /** The chosen stats for each armor type, as a list in the order Mobility/Resiliency/Recovery. */
    readonly statChoices: readonly number[][];
  }[];

  /** The first (highest-power) valid set from this stat mix. */
  readonly firstValidSet: readonly DimItem[];
  readonly firstValidSetStatChoices: readonly number[][];

  /** The maximum power loadout possible in this stat mix. */
  readonly maxPower: number;
}

export type ItemsByBucket = Readonly<{
  [bucketHash: number]: readonly DimItem[];
}>;

/**
 * Bucket lookup, also used for ordering of the buckets.
 */
export const LockableBuckets = {
  helmet: 3448274439,
  gauntlets: 3551918588,
  chest: 14239492,
  leg: 20886954,
  classitem: 1585787867,
};

export const statHashes: { [type in StatTypes]: number } = {
  Mobility: 2996146975,
  Resilience: 392767087,
  Recovery: 1943323491,
  Discipline: 1735777505,
  Intellect: 144602215,
  Strength: 4244567218,
};

export const statValues = Object.values(statHashes);
export const statKeys = Object.keys(statHashes) as StatTypes[];

// Need to force the type as lodash converts the StatTypes type to string.
export const statHashToType = _.invert(statHashes) as { [hash: number]: StatTypes };
