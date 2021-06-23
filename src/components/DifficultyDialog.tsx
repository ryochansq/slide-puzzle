import React, { VFC } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';

type Props = {
  isDialogOpen: boolean;
  split: number;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSplit: React.Dispatch<React.SetStateAction<number>>;
};

const DifficultyDialog: VFC<Props> = ({
  isDialogOpen,
  split,
  setIsDialogOpen,
  setSplit,
}: Props) => (
  <Dialog open={isDialogOpen}>
    <DialogTitle>難易度を選択</DialogTitle>
    <DialogContent>
      <RadioGroup
        value={split}
        onChange={(e) => setSplit(parseInt(e.target.value, 10))}
      >
        <FormControlLabel
          control={<Radio value={3} />}
          label="かんたん　　 3×3"
        />
        <FormControlLabel
          control={<Radio value={4} />}
          label="ふつう　　　 4×4"
        />
        <FormControlLabel
          control={<Radio value={5} />}
          label="むずかしい　 5×5"
        />
      </RadioGroup>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => setIsDialogOpen(false)}
        color="primary"
        variant="contained"
      >
        OK
      </Button>
    </DialogActions>
  </Dialog>
);
export default DifficultyDialog;
