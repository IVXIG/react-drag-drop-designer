
export interface ControlProps {
  id: string;
  type: string;
  top: number;
  left: number;
  width: number;
  height: number;
  text: string;
  isSelected: boolean;
}

export interface VB6DesignAreaProps {
  onControlsChange?: (controls: ControlProps[]) => void;
  onControlSelect?: (controlId: string | null) => void;
  selectedControlId?: string | null;
  activeTool?: string;
}
