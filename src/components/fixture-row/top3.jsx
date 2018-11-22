import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const styles = theme => ({
  margin: {
    margin: `0 ${theme.spacing.unit * 2.5}px`,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 3.5}px 0 ${theme.spacing.unit * 2.5}px`,
  },
});

function Top3(props) {
  const { classes } = props;
  return (
      <Badge color="secondary" badgeContent={props.position} className={classes.margin}>
        <span></span>
      </Badge>
  );
}

Top3.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Top3);