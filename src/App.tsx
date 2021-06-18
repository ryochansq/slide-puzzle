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

class Panel {
  i: number;

  j: number;

  split: number;

  constructor(i: number, j: number, split: number) {
    this.i = i;
    this.j = j;
    this.split = split;
  }

  key = () => this.i * (this.split + 2) + this.j;

  isLowerRight = () => this.i === this.split && this.j === this.split;
}

const di = [-1, 0, 0, 1];
const dj = [0, -1, 1, 0];

const App: VFC = () => {
  const classes = useStyles();
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  const [ratio, setRatio] = useState('100%');
  const [split] = useState(4);
  const [panels, setPanels] = useState<Panel[][]>([]);

  useEffect(() => {
    // 初期化
    const array = [...Array<Panel[]>(split + 2)].map(() =>
      Array<Panel>(split + 2).fill(new Panel(-1, -1, split))
    );
    for (let i = 0; i < split + 2; i += 1)
      for (let j = 0; j < split + 2; j += 1)
        array[i][j] = new Panel(i, j, split);

    // シャッフル
    let i = split;
    let j = split;
    for (let l = 0; l < 1000; l += 1) {
      const k = Math.floor(Math.random() * 4);
      const [ni, nj] = [i + di[k], j + dj[k]];
      if (ni >= 1 && ni <= split && nj >= 1 && nj <= split) {
        const p = new Panel(array[i][j].i, array[i][j].j, split);
        const np = new Panel(array[ni][nj].i, array[ni][nj].j, split);
        array[ni][nj] = p;
        array[i][j] = np;
        [i, j] = [ni, nj];
      }
    }
    setPanels(array);
  }, [split, imageData]);

  const xs = Math.floor(12 / split) as GridSize;
  const buttonText = imageData ? 'Select another image' : 'Select image';

  const transform = (i: number, j: number) => {
    const x = 0.5 - (j - 0.5) / split;
    const y = 0.5 - (i - 0.5) / split;
    return `scale(${split}) translate(${x * 100}%, ${y * 100}%) `;
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
    for (let k = 0; k < 4; k += 1) {
      const [ni, nj] = [i + di[k], j + dj[k]];
      if (panels[ni][nj].isLowerRight()) {
        const newPanels = panels.map((row) =>
          row.map((panel) => new Panel(panel.i, panel.j, split))
        );
        newPanels[i][j] = panels[ni][nj];
        newPanels[ni][nj] = panels[i][j];
        setPanels(newPanels);
        return;
      }
    }
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
              {panels.map((row, i) => {
                if (i < 1 || split < i) return null;
                return (
                  <Grid item container direction="row" key={row[0].key()}>
                    {row.map((el, j) => {
                      if (j < 1 || split < j) return null;
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
                            {!el.isLowerRight() && (
                              <>
                                <img
                                  src={imageData}
                                  alt="選択画像"
                                  className={classes.img}
                                  style={{
                                    transform: transform(el.i, el.j),
                                  }}
                                />
                                <button
                                  type="button"
                                  className={classes.button}
                                  onClick={() => onClick(i, j)}
                                >
                                  {' '}
                                </button>
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
      </Grid>
    </Container>
  );
};

export default App;
