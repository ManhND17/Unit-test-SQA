import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AuthButton from '@components/AuthWapperButton';

export interface ISideBarItem {
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  to?: string;
  requireAuth?: boolean;
  children?: ISideBarItem[];
}

interface ISideBarProps {
  items: ISideBarItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const MenuItemWithChildren: React.FC<{
  item: ISideBarItem;
  currentPath: string;
}> = ({ item, currentPath }) => {
  const isOpen =
    item.children?.some(
      (child) => child.to && currentPath.startsWith(child.to)
    ) || false;
  const [open, setOpen] = useState(isOpen);

  return (
    <>
      <ListItem>
        <ListItemButton
          onClick={() => setOpen(!open)}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#ccc',
            },
            '&.MuiListItemButton-root': {
              borderRadius: '8px',
            },
            '&:hover': { backgroundColor: '#ccc' },
            '&.Mui-selected:hover': { backgroundColor: '#ccc' },
            gap: '12px',
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: '24px' }}>{item.icon}</ListItemIcon>
          )}
          <ListItemText primary={item.label} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 2 }}>
          {item.children?.map((child, idx) => (
            <MenuItem
              key={child.label + idx}
              item={child}
              currentPath={currentPath}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

// Component riêng cho menu item đơn
const MenuItem: React.FC<{
  item: ISideBarItem;
  currentPath: string;
}> = ({ item, currentPath }) => {
  const hasChildren = !!item.children && item.children.length > 0;

  if (hasChildren) {
    return <MenuItemWithChildren item={item} currentPath={currentPath} />;
  }
  const isSelected =
    (!['/', '/admin', '/doctor'].includes(item.to || '') &&
      currentPath.startsWith(item.to || '')) ||
    (['/', '/admin', '/doctor'].includes(item.to || '') &&
      currentPath === item.to);

  return (
    <AuthButton action={item.action} isRequiredAuth={item.requireAuth}>
      <ListItem>
        <ListItemButton
          selected={isSelected}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#ccc',
            },
            '&.MuiListItemButton-root': {
              borderRadius: '8px',
            },
            '&:hover': { backgroundColor: '#ccc' },
            '&.Mui-selected:hover': { backgroundColor: '#ccc' },
            gap: '12px',
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: '24px' }}>{item.icon}</ListItemIcon>
          )}
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    </AuthButton>
  );
};

const SideBar: React.FC<ISideBarProps> = ({
  items,
  header,
  footer,
  className,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={`w-56 h-full bg-gray-200 pt-4 border-r border-gray-200 flex flex-col justify-between ${className || ''}`}
    >
      {header}
      <List className="flex-1" sx={{ py: 0, overflowY: 'auto' }}>
        {items.map((item, idx) =>
          item.children && item.children.length > 0 ? (
            <MenuItemWithChildren
              key={item.label + idx}
              item={item}
              currentPath={currentPath}
            />
          ) : (
            <MenuItem
              key={item.label + idx}
              item={item}
              currentPath={currentPath}
            />
          )
        )}
      </List>

      {footer && (
        <div className="border-t border-gray-200 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </aside>
  );
};

export default SideBar;
