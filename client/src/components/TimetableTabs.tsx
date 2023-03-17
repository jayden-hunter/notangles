import { Box, Tabs, Tab, MenuItem, Menu, Dialog, DialogTitle, DialogActions, TextField, Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import storage from '../utils/storage';
import { Add, MoreHoriz, ContentCopy, EditOutlined, DeleteOutline } from '@mui/icons-material';

const TimetableTabs: React.FC = () => {
  type TimetableData = {
    name: String;
    selectedCourses: Array<Object>;
    selectedClasses: Object;
    createdEvents: Object;
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [renameOpen, setRenameOpen] = useState<boolean>(false);
  const [renamedString, setRenamedString] = useState<String>('');
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const { selectedTimetable, setSelectedTimetable, displayTimetables, setDisplayTimetables } = useContext(AppContext);

  //FOR LATER WHEN WE WANT TO STYLE OUR TABS FURTHER
  const TabStyle = {
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '10px 10px 0 0',
    color: 'grey',
    margin: '3px 0 0 0',
    boxShadow: '2px -2px 2px currentcolor',
    '&.Mui-selected': { color: '#598dff' },
  };

  const ModalButtonStyle = { margin: '10px', width: '80px', alignSelf: 'center' };

  // EXPERIMENTAL: Currently removes a timetable from local storage.
  // Intended behaviour is a placeholder for the menu -> delete on the current tab
  const handleDeleteTimetable = (targetIndex: number) => {
    const oldTimetables = storage.get('timetables');
    // If only one tab then prevent the delete
    if (oldTimetables.length > 1) {
      // Intended behaviour: closing current tab will move to the NEXT (+1) tab, unless it is the last tab
      let newIndex = targetIndex + 1;
      if (newIndex >= oldTimetables.length) {
        newIndex = targetIndex - 1;
      }

      const newTimetables = oldTimetables.filter((timetable: TimetableData, index: number) => index !== targetIndex);
      storage.set('timetables', newTimetables);
      setDisplayTimetables(newTimetables);
      setSelectedTimetable(newIndex);
    }
  };

  // EXPERIMENTAL: Currently adds a new timetable to local storage
  // Future feature: should have a defined constant for max size
  const handleCreateTimetable = () => {
    const oldTimetables = storage.get('timetables');
    const nextIndex = oldTimetables.length;

    const newTimetable: TimetableData = {
      name: `Timetable${nextIndex}`,
      selectedCourses: [],
      selectedClasses: {},
      createdEvents: {},
    };
    storage.set('timetables', [...oldTimetables, newTimetable]);

    setDisplayTimetables([...oldTimetables, newTimetable]);

    //Should switch current timetable to the new timetable
    setSelectedTimetable(nextIndex);
  };

  // MENU HANDLERS
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Collapse all modals and menus
  const handleMenuClose = () => {
    setRenameOpen(false);
    setDeleteOpen(false);
    setAnchorEl(null);
  };

  const handleMenuRename = () => {
    setRenameOpen(true);
    setRenamedString(displayTimetables[selectedTimetable].name);
  };

  const handleRenameClose = () => {
    let newTimetables = [...displayTimetables];
    newTimetables[selectedTimetable].name = renamedString;

    storage.set('timetables', [...newTimetables]);
    setDisplayTimetables([...newTimetables]);

    setRenameOpen(false);
  };

  return (
    <Box sx={{ paddingTop: '10px' }}>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <ContentCopy fontSize="small" />
        </MenuItem>
        <MenuItem onClick={handleMenuRename}>
          <EditOutlined fontSize="small" />
        </MenuItem>
        <MenuItem onClick={() => setDeleteOpen(true)}>
          <DeleteOutline fontSize="small" />
        </MenuItem>
      </Menu>
      <Tabs value={selectedTimetable}>
        {displayTimetables.map((timetable: TimetableData, index: number) => (
          <Tab
            label={timetable.name}
            sx={TabStyle}
            onClick={() => setSelectedTimetable(index)}
            icon={
              selectedTimetable === index ? (
                <span onClick={handleMenuClick}>
                  <MoreHoriz />
                </span>
              ) : (
                <></>
              )
            }
            iconPosition="end"
          />
        ))}
        <Tab icon={<Add />} onClick={handleCreateTimetable} />
      </Tabs>
      <Dialog onClose={handleRenameClose} open={renameOpen}>
        <DialogTitle>Rename Timetable</DialogTitle>
        <TextField
          sx={{ padding: '10px', width: '160px', alignSelf: 'center' }}
          id="outlined-basic"
          variant="outlined"
          value={renamedString}
          onChange={(e) => setRenamedString(e.target.value)}
        />
        <Button sx={ModalButtonStyle} variant="contained" onClick={() => handleRenameClose()}>
          OK
        </Button>
      </Dialog>
      <Dialog open={deleteOpen} onClose={handleMenuClose}>
        {displayTimetables[selectedTimetable] && (
          <DialogTitle>{`Delete ${displayTimetables[selectedTimetable].name}?`}</DialogTitle>
        )}
        <DialogActions>
          <Button
            sx={ModalButtonStyle}
            variant="contained"
            onClick={() => {
              handleDeleteTimetable(selectedTimetable);
              handleMenuClose();
            }}
          >
            Yes
          </Button>
          <Button sx={ModalButtonStyle} variant="contained" onClick={handleMenuClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export { TimetableTabs };
