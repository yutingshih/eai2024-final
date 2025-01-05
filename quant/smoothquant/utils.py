import os
from pathlib import Path

import pandas as pd
import torch


DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "mps" if torch.backends.mps.is_available() else "cpu"
)
DEVICE_NAME = (
    torch.cuda.get_device_name(0) if DEVICE.type == "cuda" else DEVICE.type.upper()
)


def save_csv(
    data: dict,
    path: str | os.PathLike,
    existed: str = "append",
    verbose: bool = False,
    sort_by: str | None = None,
) -> pd.DataFrame:
    df = pd.DataFrame(data, index=[0])
    path = Path(path)

    match existed:
        case "overwrite":
            pass
        case "append":
            if path.exists():
                df = pd.concat([pd.read_csv(path, index_col=0), df])
        case "keep_both":
            cnt = 1
            while path.exists():
                path = path.with_name(f"{path.stem}-{cnt}{path.suffix}")
                cnt += 1
        case "raise":
            if path.exists():
                raise FileExistsError(f"File {path.absolute()} already exists")
        case _:
            raise ValueError(f"Unknown value for 'existed': {existed}")

    if sort_by is not None:
        df.sort_values(by=sort_by, inplace=True)

    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(path, index=False)
    if verbose:
        print(df)
    print(f"Data saved at {path.absolute()}")
    return df
