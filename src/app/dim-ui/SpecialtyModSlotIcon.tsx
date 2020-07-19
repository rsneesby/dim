import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import { DimItem, DimSocket } from 'app/inventory/item-types';
import React from 'react';
import { RootState } from 'app/store/reducers';
import { bungieBackgroundStyle } from 'app/dim-ui/BungieImage';
import { connect } from 'react-redux';
import { getSpecialtySocket } from 'app/utils/item-utils';
import styles from './SpecialtyModSlotIcon.m.scss';
import PressTip from './PressTip';
import clsx from 'clsx';

interface ProvidedProps {
  item: DimItem;
  className?: string;
  lowRes?: boolean;
}
interface StoreProps {
  defs: D2ManifestDefinitions;
}
function mapStateToProps() {
  return (state: RootState): StoreProps => ({
    defs: state.manifest.d2Manifest!,
  });
}
type Props = ProvidedProps & StoreProps;

function SpecialtyModSlotIcon({ item, className, lowRes, defs }: Props) {
  const specialtySocket = getSpecialtySocket(item);
  const emptySlotHash = specialtySocket?.socketDefinition.singleInitialItemHash;
  const emptySlotIcon = emptySlotHash && defs.InventoryItem.get(emptySlotHash);
  return emptySlotIcon ? (
    <PressTip elementType="span" tooltip={emptySlotIcon.itemTypeDisplayName}>
      <div
        className={clsx(className, styles.specialtyModIcon, { [styles.lowRes]: lowRes })}
        style={bungieBackgroundStyle(
          emptySlotIcon.displayProperties.icon,
          'linear-gradient(#0005, #0005)' // forced dark background to help w/ visibility
        )}
      />
    </PressTip>
  ) : null;
}
export default connect<StoreProps>(mapStateToProps)(SpecialtyModSlotIcon);

const armorSlotSpecificPlugCategoryIdentifier = /enhancements\.v2_(head|arms|chest|legs|class_item)/i;

/** verifies an item is d2 armor and has an armor slot specific mod socket, which is returned */
export const getArmorSlotSpecificModSocket: (item: DimItem) => DimSocket | false = (item) =>
  (item.isDestiny2() &&
    item.bucket.inArmor &&
    item.sockets?.sockets.find((socket) =>
      socket?.plug?.plugItem?.plug?.plugCategoryIdentifier.match(
        armorSlotSpecificPlugCategoryIdentifier
      )
    )) ??
  false;

/** this returns a string for easy printing purposes. '' if not found */
export const getArmorSlotSpecificModSocketDisplayName: (item: DimItem) => string = (item) => {
  const foundSocket = getArmorSlotSpecificModSocket(item);
  return (foundSocket && foundSocket.plug!.plugItem.itemTypeDisplayName) || '';
};

function disconnectedArmorSlotSpecificModSocketIcon({ item, className, lowRes, defs }: Props) {
  const foundSocket = getArmorSlotSpecificModSocket(item);
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  const emptySocketHash = foundSocket && foundSocket.socketDefinition.singleInitialItemHash;
  const emptySocketIcon = emptySocketHash && defs.InventoryItem.get(emptySocketHash);
  return emptySocketIcon ? (
    <PressTip elementType="span" tooltip={emptySocketIcon.itemTypeDisplayName}>
      <div
        className={`${className} ${styles.specialtyModIcon} ${lowRes ? styles.lowRes : ''}`}
        style={bungieBackgroundStyle(emptySocketIcon.displayProperties.icon)}
      />
    </PressTip>
  ) : null;
}
export const ArmorSlotSpecificModSocketIcon = connect<StoreProps>(mapStateToProps)(
  disconnectedArmorSlotSpecificModSocketIcon
);
