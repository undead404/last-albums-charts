package interfaces

type SubApp struct {
	ControlChannel chan int
	// ErrorChannel chan error
}
type ISubApp interface {
	// HandleError (error)
	Start()
	Run(chan int)
}
