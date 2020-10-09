import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, projects, ...rest }) => {
  const classes = useStyles();
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedProjectIds;

    if (event.target.checked) {
      newSelectedProjectIds = projects.map((project) => project.id);
    } else {
      newSelectedProjectIds = [];
    }

    setSelectedProjectIds(newSelectedProjectIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProjectIds.indexOf(id);
    let newSelectedProjectIds = [];

    if (selectedIndex === -1) {
      newSelectedProjectIds = newSelectedProjectIds.concat(selectedProjectIds, id);
    } else if (selectedIndex === 0) {
      newSelectedProjectIds = newSelectedProjectIds.concat(selectedProjectIds.slice(1));
    } else if (selectedIndex === selectedProjectIds.length - 1) {
      newSelectedProjectIds = newSelectedProjectIds.concat(selectedProjectIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedProjectIds = newSelectedProjectIds.concat(
        selectedProjectIds.slice(0, selectedIndex),
        selectedProjectIds.slice(selectedIndex + 1)
      );
    }

    setSelectedProjectIds(newSelectedProjectIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProjectIds.length === projects.length}
                    color="primary"
                    indeterminate={
                      selectedProjectIds.length > 0
                      && selectedProjectIds.length < projects.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Location
                </TableCell>
                <TableCell>
                  Manager
                </TableCell>
                <TableCell>
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.slice(0, limit).map((project) => (
                <TableRow
                  hover
                  key={project.id}
                  selected={selectedProjectIds.indexOf(project.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProjectIds.indexOf(project.id) !== -1}
                      onChange={(event) => handleSelectOne(event, project.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {project.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {`${project.address.city}, ${project.address.state}, ${project.address.country}`}
                  </TableCell>
                  <TableCell>
                    {project.manager}
                  </TableCell>
                  <TableCell>
                    {moment(project.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={projects.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  projects: PropTypes.array.isRequired
};

export default Results;
