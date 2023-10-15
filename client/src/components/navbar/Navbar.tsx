import { Description, Info, Security, Settings as SettingsIcon } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, useMediaQuery, useTheme, FormControl, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext, useState } from 'react';

import notanglesLogoGif from '../../assets/notangles.gif';
import notanglesLogo from '../../assets/notangles_1.png';
import { ThemeType } from '../../constants/theme';
import { AppContext } from '../../context/AppContext';
import { CourseContext } from '../../context/CourseContext';
import About from './About';
import Changelog from './Changelog';
import CustomModal from './CustomModal';
import Privacy from './Privacy';
import Settings from './Settings';

const LogoImg = styled('img')`
  height: 46px;
  margin-right: 12.5px;
  margin-top: -2px;
  margin-left: -11.5px;
`;

const NavbarBox = styled('div')`
  flex-grow: 1;
  position: fixed;
  margin-left: 0px;
  z-index: 1201; /* overriding https://material-ui.com/customization/z-index/ */
`;

const StyledNavBar = styled(AppBar)`
  background: ${({ theme }) => theme.palette.primary.main};
  z-index: 1201;
`;

const NavbarTitle = styled(Typography)`
  flex-grow: 1;
  z-index: 1201;
`;


const Navbar: React.FC = () => {
  const [currLogo, setCurrLogo] = useState(notanglesLogo);

  const {
    term,
    termName,
    setTermName,
    year,
    setTerm,
    setYear,
    setSelectedTimetable,
    displayTimetables,
    termsData
  } = useContext(AppContext);

  const { setSelectedCourses, setSelectedClasses, setCreatedEvents } =
    useContext(CourseContext);

  const theme = useTheme<ThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const selectTerm = (e: any) => {
    const defaultStartTimetable = 0;

    let newTermName = e.target.value.split(', ')[0]
    let termNum = 'T' + newTermName.split(' ')[1]
    let newYear = e.target.value.split(', ')[1]

    setTerm(termNum)
    setYear(newYear)
    setTermName(newTermName)
    setSelectedTimetable(defaultStartTimetable);
    setSelectedClasses(displayTimetables[termNum][defaultStartTimetable].selectedClasses);
    setCreatedEvents(displayTimetables[termNum][defaultStartTimetable].createdEvents);
    setSelectedCourses(displayTimetables[termNum][defaultStartTimetable].selectedCourses);
  }

  let termData = new Set([termsData.prevTerm.termName.concat(', ', termsData.prevTerm.year), termsData.newTerm.termName.concat(', ', termsData.newTerm.year)]);
  return (
    <NavbarBox>
      <StyledNavBar enableColorOnDark position="fixed">
        <Toolbar>
          <LogoImg
            src={currLogo}
            alt="Notangles logo"
            onMouseOver={() => setCurrLogo(notanglesLogoGif)}
            onMouseOut={() => setCurrLogo(notanglesLogo)}
          />
          <NavbarTitle variant="h6">
            Notangles
          </NavbarTitle>
          <FormControl>
            <Select
              value={isMobile ? term : termName.concat(', ', year)}
              onChange={selectTerm}
            >
              {
                Array.from(termData).map((term, index) => {
                  return <MenuItem key={index} value={term}>{term}</MenuItem>;
                })
              }
            </Select>
          </FormControl>
          <CustomModal
            title="About"
            showIcon={<Info />}
            description={'Notangles: no more timetable tangles'}
            content={<About />}
          />
          <CustomModal title="Changelog" showIcon={<Description />} description={'Changelog'} content={<Changelog />} />
          <CustomModal
            title="Privacy"
            showIcon={<Security />}
            description={'Application Privacy Statement'}
            content={<Privacy />}
          />
          <CustomModal title="Settings" showIcon={<SettingsIcon />} description={'Settings'} content={<Settings />} />
        </Toolbar>
      </StyledNavBar>
    </NavbarBox>
  );
};

export default Navbar;
