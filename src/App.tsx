import { VFC, useState, useEffect } from 'react';
import {
  Button,
  Container,
  CssBaseline,
  Grid,
  GridSize,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Puzzle from './classes/Puzzle';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      userSelect: 'none',
    },
    imgWrapper: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
    },
    img: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    button: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      color: 'transparent',
      cursor: 'pointer',
      padding: 0,
    },
  })
);

const App: VFC = () => {
  const classes = useStyles();
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  const [ratio, setRatio] = useState('100%');
  const [puzzle, setPuzzle] = useState<Puzzle>(new Puzzle(4, false));

  useEffect(() => {
    setPuzzle((prevPuzzle) => new Puzzle(prevPuzzle.split, true));
  }, [imageData]);

  const xs = Math.floor(12 / puzzle.split) as GridSize;
  const buttonText = imageData ? 'Select another image' : 'Select image';

  const transform = (i: number, j: number) => {
    const x = 0.5 - (j - 0.5) / puzzle.split;
    const y = 0.5 - (i - 0.5) / puzzle.split;
    return `scale(${puzzle.split}) translate(${x * 100}%, ${y * 100}%) `;
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { files } = target;
    const file = files && files.length ? files[0] : null;
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      setRatio(`${(img.naturalHeight / img.naturalWidth) * 100}%`);
    };
    img.src = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const { result } = reader;

      setImageData(result as string);
    };
  };

  const onClick = (i: number, j: number) => {
    const newPuzzle = puzzle.onClick(i, j);
    setPuzzle(newPuzzle);
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <CssBaseline />
      <Grid container spacing={4}>
        <Grid item container justify="center">
          <Typography component="h1" variant="h5">
            Slide Puzzle Maker
          </Typography>
        </Grid>
        <Grid item container justify="center">
          <Button
            fullWidth={!imageData}
            variant="contained"
            color="primary"
            component="label"
          >
            {buttonText}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onChangeInput}
            />
          </Button>
        </Grid>
        {imageData && (
          <>
            <Grid item container xs={12}>
              {puzzle.panels.map((row, i) => {
                if (i < 1 || puzzle.split < i) return null;
                return (
                  <Grid item container direction="row" key={row[0].key()}>
                    {row.map((el, j) => {
                      if (j < 1 || puzzle.split < j) return null;
                      return (
                        <Grid
                          item
                          container
                          key={el.key()}
                          xs={xs}
                          justify="center"
                        >
                          <div
                            className={classes.imgWrapper}
                            style={{
                              paddingTop: ratio,
                            }}
                          >
                            {(!el.isLowerRight || puzzle.solved()) && (
                              <>
                                <img
                                  src={imageData}
                                  alt="選択画像"
                                  className={classes.img}
                                  style={{
                                    transform: transform(el.i, el.j),
                                  }}
                                />
                                {!puzzle.solved() && (
                                  <button
                                    type="button"
                                    className={classes.button}
                                    onClick={() => onClick(i, j)}
                                  >
                                    {' '}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
        {puzzle.solved() && (
          <Grid item container justify="center">
            <Typography component="h1" variant="h5">
              Congratulations!!
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default App;
